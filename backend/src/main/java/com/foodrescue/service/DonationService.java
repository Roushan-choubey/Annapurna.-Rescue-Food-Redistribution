package com.foodrescue.service;

import com.foodrescue.dto.AcceptDonationRequest;
import com.foodrescue.dto.DonationRequest;
import com.foodrescue.dto.DonationResponse;
import com.foodrescue.exception.AppException;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.model.*;
import com.foodrescue.repository.FoodDonationRepository;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.PickupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private FoodDonationRepository donationRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public DonationResponse createDonation(DonationRequest req, User donor) {
        // FR-2.5: best-before must be after preparation time and in the future
        if (req.getExpiryTime().isBefore(req.getPreparationTime()) || req.getExpiryTime().isEqual(req.getPreparationTime())) {
            throw new AppException("Best-before time must be strictly after the preparation time");
        }
        if (req.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException("Best-before time must be in the future");
        }

        Double lat = req.getLatitude() != null ? req.getLatitude() : (donor.getLatitude() != null ? donor.getLatitude() : 26.8467);
        Double lng = req.getLongitude() != null ? req.getLongitude() : (donor.getLongitude() != null ? donor.getLongitude() : 80.9462);

        FoodDonation donation = new FoodDonation(
                donor,
                req.getFoodName(),
                req.getQuantity(),
                req.getPeopleServed(),
                req.getPreparationTime(),
                req.getExpiryTime(),
                req.getFoodType(),
                req.getLocation(),
                lat,
                lng,
                req.getImageUrl(),
                req.getContactPhone() != null ? req.getContactPhone() : donor.getPhone()
        );

        FoodDonation saved = donationRepository.save(donation);

        // FR-6.1: notify nearby verified NGOs
        notificationService.notifyNearbyNgos(saved);

        return toResponse(saved, null, null);
    }

    public List<DonationResponse> getMyDonations(User donor) {
        return donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .map(d -> toResponse(d, null, null))
                .collect(Collectors.toList());
    }

    public DonationResponse getDonationById(Long id, User currentUser) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        Double lat = currentUser != null ? currentUser.getLatitude() : null;
        Double lng = currentUser != null ? currentUser.getLongitude() : null;
        return toResponse(donation, lat, lng);
    }

    @Transactional
    public DonationResponse updateDonation(Long id, DonationRequest req, User donor) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only edit your own donations");
        }

        // FR-2.4: Edit only while status is AVAILABLE
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new AppException("Only donations with status AVAILABLE can be edited");
        }

        if (req.getExpiryTime().isBefore(req.getPreparationTime()) || req.getExpiryTime().isEqual(req.getPreparationTime())) {
            throw new AppException("Best-before time must be strictly after the preparation time");
        }
        if (req.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException("Best-before time must be in the future");
        }

        donation.setFoodName(req.getFoodName());
        donation.setQuantity(req.getQuantity());
        donation.setPeopleServed(req.getPeopleServed());
        donation.setPreparationTime(req.getPreparationTime());
        donation.setExpiryTime(req.getExpiryTime());
        donation.setFoodType(req.getFoodType());
        donation.setLocation(req.getLocation());
        if (req.getLatitude() != null) donation.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) donation.setLongitude(req.getLongitude());
        if (req.getImageUrl() != null) donation.setImageUrl(req.getImageUrl());
        if (req.getContactPhone() != null) donation.setContactPhone(req.getContactPhone());

        FoodDonation updated = donationRepository.save(donation);
        return toResponse(updated, null, null);
    }

    @Transactional
    public void cancelDonation(Long id, User donor) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only cancel your own donations");
        }

        // FR-2.4: Cancel only while status is AVAILABLE
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new AppException("Only donations with status AVAILABLE can be cancelled");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);
    }

    public List<DonationResponse> searchAvailableDonations(
            Double userLat, Double userLng, Double radiusKm,
            FoodType foodType, Double minQty) {

        List<FoodDonation> list = donationRepository.searchAvailable(
                DonationStatus.AVAILABLE,
                foodType,
                minQty
        );

        LocalDateTime now = LocalDateTime.now();

        return list.stream()
                .filter(d -> d.getExpiryTime().isAfter(now))
                .map(d -> toResponse(d, userLat, userLng))
                .filter(d -> {
                    if (radiusKm != null && radiusKm > 0 && d.getDistanceKm() != null) {
                        return d.getDistanceKm() <= radiusKm;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    if (a.getDistanceKm() != null && b.getDistanceKm() != null) {
                        return Double.compare(a.getDistanceKm(), b.getDistanceKm());
                    }
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public synchronized DonationResponse acceptDonation(Long id, User ngoUser, AcceptDonationRequest req) {
        // FR-1.5: NGO accounts cannot accept donations until verified by admin
        Ngo ngo = ngoRepository.findByUser(ngoUser)
                .orElseThrow(() -> new AppException("No NGO profile associated with this account"));

        if (!Boolean.TRUE.equals(ngo.getVerified())) {
            throw new AppException("Your NGO account is awaiting Admin verification. Only verified NGOs can accept donations.");
        }

        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        // FR-3.3: First NGO to accept wins
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new AppException("This donation is no longer available. Status is: " + donation.getStatus());
        }

        if (donation.getExpiryTime().isBefore(LocalDateTime.now())) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);
            throw new AppException("This donation has expired and cannot be accepted");
        }

        Pickup pickup = new Pickup(donation, ngo);

        // FR-3.5: NGO's own transport or request a volunteer
        boolean isNgoTransport = req != null && "NGO_TRANSPORT".equalsIgnoreCase(req.getCollectionMethod());
        if (isNgoTransport) {
            donation.setStatus(DonationStatus.ASSIGNED);
            pickup.setStatus(PickupStatus.ASSIGNED);
        } else {
            donation.setStatus(DonationStatus.ACCEPTED);
            pickup.setStatus(PickupStatus.PENDING);
        }

        donationRepository.save(donation);
        Pickup savedPickup = pickupRepository.save(pickup);

        // Notify donor
        String notifMsg = String.format("Good news! Your donation '%s' was accepted by '%s'.",
                donation.getFoodName(), ngo.getName());
        notificationService.createNotification(donation.getDonor(), "Donation Accepted", notifMsg);

        return toResponse(donation, ngoUser.getLatitude(), ngoUser.getLongitude());
    }

    public DonationResponse toResponse(FoodDonation donation, Double callerLat, Double callerLng) {
        DonationResponse resp = new DonationResponse();
        resp.setId(donation.getId());
        resp.setFoodName(donation.getFoodName());
        resp.setQuantity(donation.getQuantity());
        resp.setPeopleServed(donation.getPeopleServed());
        resp.setPreparationTime(donation.getPreparationTime());
        resp.setExpiryTime(donation.getExpiryTime());
        resp.setFoodType(donation.getFoodType());
        resp.setLocation(donation.getLocation());
        resp.setLatitude(donation.getLatitude());
        resp.setLongitude(donation.getLongitude());
        resp.setImageUrl(donation.getImageUrl());
        resp.setContactPhone(donation.getContactPhone());
        resp.setStatus(donation.getStatus());
        resp.setCreatedAt(donation.getCreatedAt());

        if (donation.getDonor() != null) {
            resp.setDonorId(donation.getDonor().getId());
            resp.setDonorName(donation.getDonor().getName());
            resp.setDonorEmail(donation.getDonor().getEmail());
        }

        // Distance calculation
        if (callerLat != null && callerLng != null && donation.getLatitude() != null && donation.getLongitude() != null) {
            resp.setDistanceKm(calculateDistanceKm(callerLat, callerLng, donation.getLatitude(), donation.getLongitude()));
        }

        // Attach pickup info if exists
        Optional<Pickup> pickupOpt = pickupRepository.findByDonation(donation);
        if (pickupOpt.isPresent()) {
            Pickup p = pickupOpt.get();
            resp.setPickupId(p.getId());
            if (p.getNgo() != null) {
                resp.setAcceptedNgoName(p.getNgo().getName());
            }
            if (p.getVolunteer() != null) {
                resp.setAssignedVolunteerName(p.getVolunteer().getName());
            }
        }

        return resp;
    }

    // Haversine formula to compute great-circle distance between two points in km
    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((R * c) * 10.0) / 10.0;
    }
}
