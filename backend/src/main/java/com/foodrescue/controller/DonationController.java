package com.foodrescue.controller;

import com.foodrescue.dto.AcceptDonationRequest;
import com.foodrescue.dto.DonationRequest;
import com.foodrescue.dto.DonationResponse;
import com.foodrescue.model.FoodType;
import com.foodrescue.model.User;
import com.foodrescue.service.AuthService;
import com.foodrescue.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationResponse> createDonation(
            @Valid @RequestBody DonationRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        User donor = authService.getCurrentUser(userDetails.getUsername());
        DonationResponse response = donationService.createDonation(req, donor);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<DonationResponse>> getMyDonations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User donor = authService.getCurrentUser(userDetails.getUsername());
        List<DonationResponse> response = donationService.getMyDonations(donor);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('NGO', 'VOLUNTEER', 'ADMIN')")
    public ResponseEntity<List<DonationResponse>> getAvailableDonations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radius,
            @RequestParam(required = false) FoodType type,
            @RequestParam(required = false) Double minQty,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // If lat/lng not provided in query params, fall back to user's registered location
        if (lat == null || lng == null) {
            User user = authService.getCurrentUser(userDetails.getUsername());
            if (user != null) {
                lat = user.getLatitude();
                lng = user.getLongitude();
            }
        }

        List<DonationResponse> response = donationService.searchAvailableDonations(lat, lng, radius, type, minQty);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userDetails != null ? authService.getCurrentUser(userDetails.getUsername()) : null;
        DonationResponse response = donationService.getDonationById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationResponse> updateDonation(
            @PathVariable Long id,
            @Valid @RequestBody DonationRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        User donor = authService.getCurrentUser(userDetails.getUsername());
        DonationResponse response = donationService.updateDonation(id, req, donor);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> cancelDonation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User donor = authService.getCurrentUser(userDetails.getUsername());
        donationService.cancelDonation(id, donor);
        return ResponseEntity.ok(Map.of("message", "Donation cancelled successfully", "id", id));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<DonationResponse> acceptDonation(
            @PathVariable Long id,
            @RequestBody(required = false) AcceptDonationRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        User ngoUser = authService.getCurrentUser(userDetails.getUsername());
        DonationResponse response = donationService.acceptDonation(id, ngoUser, req != null ? req : new AcceptDonationRequest("VOLUNTEER_REQUEST"));
        return ResponseEntity.ok(response);
    }
}
