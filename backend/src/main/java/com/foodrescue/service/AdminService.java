package com.foodrescue.service;

import com.foodrescue.dto.DashboardStatsDto;
import com.foodrescue.dto.DonationResponse;
import com.foodrescue.dto.UserDto;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.model.*;
import com.foodrescue.repository.FoodDonationRepository;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.PickupRepository;
import com.foodrescue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private FoodDonationRepository donationRepository;

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private NotificationService notificationService;

    public List<UserDto> getAllUsers(String search) {
        List<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search.trim(), search.trim());
        } else {
            users = userRepository.findAllByOrderByCreatedAtDesc();
        }

        return users.stream().map(this::toUserDto).collect(Collectors.toList());
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsActive(isActive);
        User saved = userRepository.save(user);
        return toUserDto(saved);
    }

    public List<UserDto> getPendingNgos() {
        return ngoRepository.findByVerifiedFalse().stream()
                .map(ngo -> {
                    UserDto dto = toUserDto(ngo.getUser());
                    dto.setNgoId(ngo.getId());
                    dto.setRegistrationNumber(ngo.getRegistrationNumber());
                    dto.setVerified(ngo.getVerified());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto verifyNgo(Long ngoId, Boolean verified) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new ResourceNotFoundException("NGO not found with id: " + ngoId));

        ngo.setVerified(verified);
        Ngo saved = ngoRepository.save(ngo);

        // Notify NGO account
        String title = verified ? "NGO Account Approved!" : "NGO Account Verification Update";
        String msg = verified ?
                "Congratulations! Your NGO has been verified by the Admin. You can now browse and accept surplus food donations." :
                "Your NGO verification request was declined. Please verify your registration documents with support.";
        notificationService.createNotification(saved.getUser(), title, msg);

        UserDto dto = toUserDto(saved.getUser());
        dto.setNgoId(saved.getId());
        dto.setRegistrationNumber(saved.getRegistrationNumber());
        dto.setVerified(saved.getVerified());
        return dto;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalDonations(donationRepository.count());
        Double rescuedKg = donationRepository.sumCompletedQuantity();
        stats.setTotalFoodRescuedKg(rescuedKg != null ? Math.round(rescuedKg * 10.0) / 10.0 : 0.0);

        Integer peopleServed = donationRepository.sumCompletedPeopleServed();
        stats.setTotalPeopleServed(peopleServed != null ? peopleServed : 0);

        stats.setActiveDonors(userRepository.countByRoleAndIsActiveTrue(Role.DONOR));
        stats.setActiveNgos(userRepository.countByRoleAndIsActiveTrue(Role.NGO));
        stats.setActiveVolunteers(userRepository.countByRoleAndIsActiveTrue(Role.VOLUNTEER));

        stats.setCompletedDonations(donationRepository.countByStatus(DonationStatus.COMPLETED));
        stats.setExpiredDonations(donationRepository.countByStatus(DonationStatus.EXPIRED));
        stats.setAvailableDonations(donationRepository.countByStatus(DonationStatus.AVAILABLE));

        long inProgress = donationRepository.countByStatus(DonationStatus.ACCEPTED)
                + donationRepository.countByStatus(DonationStatus.ASSIGNED)
                + donationRepository.countByStatus(DonationStatus.COLLECTED)
                + donationRepository.countByStatus(DonationStatus.DELIVERED);
        stats.setInProgressDonations(inProgress);

        stats.setPendingNgoVerifications(ngoRepository.findByVerifiedFalse().size());

        return stats;
    }

    public List<DonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(d -> donationService.toResponse(d, null, null))
                .collect(Collectors.toList());
    }

    public String generateReportCsv(LocalDateTime from, LocalDateTime to) {
        LocalDateTime start = from != null ? from : LocalDateTime.now().minusDays(30);
        LocalDateTime end = to != null ? to : LocalDateTime.now().plusDays(1);

        List<FoodDonation> list = donationRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Food Name,Quantity (kg),People Served,Food Type,Status,Location,Donor Name,Created At,Expiry Time\n");

        for (FoodDonation d : list) {
            csv.append(d.getId()).append(",")
               .append("\"").append(d.getFoodName().replace("\"", "\"\"")).append("\",")
               .append(d.getQuantity()).append(",")
               .append(d.getPeopleServed()).append(",")
               .append(d.getFoodType()).append(",")
               .append(d.getStatus()).append(",")
               .append("\"").append(d.getLocation().replace("\"", "\"\"")).append("\",")
               .append("\"").append(d.getDonor() != null ? d.getDonor().getName().replace("\"", "\"\"") : "").append("\",")
               .append(d.getCreatedAt()).append(",")
               .append(d.getExpiryTime()).append("\n");
        }

        return csv.toString();
    }

    private UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setAddress(user.getAddress());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getRole() == Role.NGO) {
            Optional<Ngo> ngoOpt = ngoRepository.findByUser(user);
            if (ngoOpt.isPresent()) {
                dto.setNgoId(ngoOpt.get().getId());
                dto.setRegistrationNumber(ngoOpt.get().getRegistrationNumber());
                dto.setVerified(ngoOpt.get().getVerified());
            }
        }

        return dto;
    }
}
