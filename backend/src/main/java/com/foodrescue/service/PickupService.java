package com.foodrescue.service;

import com.foodrescue.dto.CompletePickupRequest;
import com.foodrescue.dto.DonationResponse;
import com.foodrescue.dto.PickupResponse;
import com.foodrescue.exception.AppException;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.model.*;
import com.foodrescue.repository.FoodDonationRepository;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.PickupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupService {

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private FoodDonationRepository donationRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private NotificationService notificationService;

    public List<PickupResponse> getOpenPickups(Double userLat, Double userLng) {
        // FR-4.1: View open pickup requests (unassigned)
        return pickupRepository.findByVolunteerIsNullAndStatusOrderByCreatedAtDesc(PickupStatus.PENDING).stream()
                .map(p -> toPickupResponse(p, userLat, userLng))
                .collect(Collectors.toList());
    }

    @Transactional
    public synchronized PickupResponse acceptPickup(Long pickupId, User volunteer) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found: " + pickupId));

        if (pickup.getVolunteer() != null || pickup.getStatus() != PickupStatus.PENDING) {
            throw new AppException("This pickup request has already been assigned to another volunteer");
        }

        pickup.setVolunteer(volunteer);
        pickup.setStatus(PickupStatus.ASSIGNED);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.ASSIGNED);

        donationRepository.save(donation);
        Pickup saved = pickupRepository.save(pickup);

        // Notify donor and NGO
        notificationService.createNotification(
                donation.getDonor(),
                "Volunteer Assigned",
                String.format("Volunteer %s has accepted the pickup for '%s'.", volunteer.getName(), donation.getFoodName())
        );

        if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
            notificationService.createNotification(
                    pickup.getNgo().getUser(),
                    "Volunteer Assigned",
                    String.format("Volunteer %s will pick up '%s'.", volunteer.getName(), donation.getFoodName())
            );
        }

        return toPickupResponse(saved, volunteer.getLatitude(), volunteer.getLongitude());
    }

    @Transactional
    public PickupResponse markCollected(Long pickupId, User volunteer) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found: " + pickupId));

        // Ensure authorized volunteer
        if (pickup.getVolunteer() != null && !pickup.getVolunteer().getId().equals(volunteer.getId()) && volunteer.getRole() != Role.ADMIN) {
            throw new AppException("You are not the assigned volunteer for this pickup");
        }

        if (pickup.getStatus() != PickupStatus.ASSIGNED) {
            throw new AppException("Pickup must be in ASSIGNED state before marking as collected");
        }

        pickup.setPickupTime(LocalDateTime.now());
        pickup.setStatus(PickupStatus.COLLECTED);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.COLLECTED);

        donationRepository.save(donation);
        Pickup saved = pickupRepository.save(pickup);

        notificationService.createNotification(
                donation.getDonor(),
                "Food Collected",
                String.format("Your donation '%s' has been collected from your location.", donation.getFoodName())
        );

        return toPickupResponse(saved, volunteer.getLatitude(), volunteer.getLongitude());
    }

    @Transactional
    public PickupResponse markDelivered(Long pickupId, User volunteer) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found: " + pickupId));

        if (pickup.getVolunteer() != null && !pickup.getVolunteer().getId().equals(volunteer.getId()) && volunteer.getRole() != Role.ADMIN) {
            throw new AppException("You are not the assigned volunteer for this pickup");
        }

        if (pickup.getStatus() != PickupStatus.COLLECTED) {
            throw new AppException("Food must be marked COLLECTED before it can be marked as DELIVERED");
        }

        pickup.setDeliveryTime(LocalDateTime.now());
        pickup.setStatus(PickupStatus.DELIVERED);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.DELIVERED);

        donationRepository.save(donation);
        Pickup saved = pickupRepository.save(pickup);

        // Notify NGO that food has arrived
        if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
            notificationService.createNotification(
                    pickup.getNgo().getUser(),
                    "Food Delivered",
                    String.format("Food for '%s' has arrived at your distribution center. Please confirm receipt.", donation.getFoodName())
            );
        }

        return toPickupResponse(saved, volunteer.getLatitude(), volunteer.getLongitude());
    }

    @Transactional
    public PickupResponse completePickup(Long pickupId, User ngoUser, CompletePickupRequest req) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found: " + pickupId));

        Ngo ngo = ngoRepository.findByUser(ngoUser)
                .orElseThrow(() -> new AppException("No NGO associated with this account"));

        if (!pickup.getNgo().getId().equals(ngo.getId()) && ngoUser.getRole() != Role.ADMIN) {
            throw new AppException("You are not authorized to complete this pickup");
        }

        pickup.setPeopleServedActual(req.getPeopleServedActual());
        pickup.setStatus(PickupStatus.COMPLETED);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.COMPLETED);

        donationRepository.save(donation);
        Pickup saved = pickupRepository.save(pickup);

        // Notify donor of impact
        notificationService.createNotification(
                donation.getDonor(),
                "Rescue Completed!",
                String.format("Thank you! Your donation '%s' was successfully distributed, feeding %d people in need!",
                        donation.getFoodName(), req.getPeopleServedActual())
        );

        return toPickupResponse(saved, ngoUser.getLatitude(), ngoUser.getLongitude());
    }

    public List<PickupResponse> getMyPickups(User user) {
        if (user.getRole() == Role.NGO) {
            return ngoRepository.findByUser(user)
                    .map(ngo -> pickupRepository.findByNgoOrderByCreatedAtDesc(ngo).stream()
                            .map(p -> toPickupResponse(p, user.getLatitude(), user.getLongitude()))
                            .collect(Collectors.toList()))
                    .orElse(Collections.emptyList());
        } else if (user.getRole() == Role.VOLUNTEER) {
            return pickupRepository.findByVolunteerOrderByCreatedAtDesc(user).stream()
                    .map(p -> toPickupResponse(p, user.getLatitude(), user.getLongitude()))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public PickupResponse toPickupResponse(Pickup p, Double callerLat, Double callerLng) {
        PickupResponse resp = new PickupResponse();
        resp.setId(p.getId());
        resp.setPickupTime(p.getPickupTime());
        resp.setDeliveryTime(p.getDeliveryTime());
        resp.setPeopleServedActual(p.getPeopleServedActual());
        resp.setStatus(p.getStatus());
        resp.setCreatedAt(p.getCreatedAt());

        if (p.getDonation() != null) {
            DonationResponse donResp = donationService.toResponse(p.getDonation(), callerLat, callerLng);
            resp.setDonation(donResp);

            // Google Maps Navigation Links
            try {
                String destPickup;
                if (p.getDonation().getLatitude() != null && p.getDonation().getLongitude() != null) {
                    destPickup = p.getDonation().getLatitude() + "," + p.getDonation().getLongitude();
                } else {
                    destPickup = URLEncoder.encode(p.getDonation().getLocation(), StandardCharsets.UTF_8);
                }
                resp.setPickupNavigationUrl("https://www.google.com/maps/dir/?api=1&destination=" + destPickup);
            } catch (Exception ignored) {}
        }

        if (p.getNgo() != null) {
            resp.setNgoId(p.getNgo().getId());
            resp.setNgoName(p.getNgo().getName());
            resp.setNgoPhone(p.getNgo().getPhone());
            resp.setNgoAddress(p.getNgo().getAddress());

            try {
                String destDrop;
                if (p.getNgo().getUser() != null && p.getNgo().getUser().getLatitude() != null && p.getNgo().getUser().getLongitude() != null) {
                    destDrop = p.getNgo().getUser().getLatitude() + "," + p.getNgo().getUser().getLongitude();
                } else if (p.getNgo().getAddress() != null) {
                    destDrop = URLEncoder.encode(p.getNgo().getAddress(), StandardCharsets.UTF_8);
                } else {
                    destDrop = "";
                }
                if (!destDrop.isEmpty()) {
                    resp.setDropNavigationUrl("https://www.google.com/maps/dir/?api=1&destination=" + destDrop);
                }
            } catch (Exception ignored) {}
        }

        if (p.getVolunteer() != null) {
            resp.setVolunteerId(p.getVolunteer().getId());
            resp.setVolunteerName(p.getVolunteer().getName());
            resp.setVolunteerPhone(p.getVolunteer().getPhone());
        }

        return resp;
    }
}
