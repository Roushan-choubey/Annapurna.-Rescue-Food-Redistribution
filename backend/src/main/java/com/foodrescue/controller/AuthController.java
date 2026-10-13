package com.foodrescue.controller;

import com.foodrescue.dto.AuthRequest;
import com.foodrescue.dto.AuthResponse;
import com.foodrescue.dto.RegisterRequest;
import com.foodrescue.model.Ngo;
import com.foodrescue.model.Role;
import com.foodrescue.model.User;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private NgoRepository ngoRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse response = authService.register(req);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns the current user's profile as a safe DTO (never exposes password hash).
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.notFound().build();
        }
        User user = authService.getCurrentUser(userDetails.getUsername());

        boolean verified = true;
        if (user.getRole() == Role.NGO) {
            verified = ngoRepository.findByUser(user)
                    .map(Ngo::getVerified)
                    .orElse(false);
        }

        AuthResponse response = new AuthResponse(
                null, // No new token needed for profile fetch
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                verified,
                user.getPhone(),
                user.getAddress(),
                user.getLatitude(),
                user.getLongitude()
        );
        return ResponseEntity.ok(response);
    }
}
