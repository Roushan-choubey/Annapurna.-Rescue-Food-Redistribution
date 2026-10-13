package com.foodrescue.controller;

import com.foodrescue.dto.CompletePickupRequest;
import com.foodrescue.dto.PickupResponse;
import com.foodrescue.model.User;
import com.foodrescue.service.AuthService;
import com.foodrescue.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    @Autowired
    private PickupService pickupService;

    @Autowired
    private AuthService authService;

    @GetMapping("/open")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public ResponseEntity<List<PickupResponse>> getOpenPickups(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (lat == null || lng == null) {
            User user = authService.getCurrentUser(userDetails.getUsername());
            if (user != null) {
                lat = user.getLatitude();
                lng = user.getLongitude();
            }
        }
        List<PickupResponse> response = pickupService.getOpenPickups(lat, lng);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<PickupResponse> acceptPickup(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User volunteer = authService.getCurrentUser(userDetails.getUsername());
        PickupResponse response = pickupService.acceptPickup(id, volunteer);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/collected")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<PickupResponse> markCollected(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User volunteer = authService.getCurrentUser(userDetails.getUsername());
        PickupResponse response = pickupService.markCollected(id, volunteer);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/delivered")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<PickupResponse> markDelivered(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User volunteer = authService.getCurrentUser(userDetails.getUsername());
        PickupResponse response = pickupService.markDelivered(id, volunteer);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<PickupResponse> completePickup(
            @PathVariable Long id,
            @Valid @RequestBody CompletePickupRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        User ngoUser = authService.getCurrentUser(userDetails.getUsername());
        PickupResponse response = pickupService.completePickup(id, ngoUser, req);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('NGO', 'VOLUNTEER')")
    public ResponseEntity<List<PickupResponse>> getMyPickups(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        List<PickupResponse> response = pickupService.getMyPickups(user);
        return ResponseEntity.ok(response);
    }
}
