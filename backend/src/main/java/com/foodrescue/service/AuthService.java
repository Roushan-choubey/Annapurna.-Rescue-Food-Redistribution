package com.foodrescue.service;

import com.foodrescue.dto.AuthRequest;
import com.foodrescue.dto.AuthResponse;
import com.foodrescue.dto.RegisterRequest;
import com.foodrescue.exception.AppException;
import com.foodrescue.exception.ResourceNotFoundException;
import com.foodrescue.model.Ngo;
import com.foodrescue.model.Role;
import com.foodrescue.model.User;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.UserRepository;
import com.foodrescue.security.JwtUtil;
import com.foodrescue.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("Email is already registered: " + req.getEmail());
        }

        if (req.getRole() == Role.NGO) {
            if (req.getRegistrationNumber() == null || req.getRegistrationNumber().trim().isEmpty()) {
                throw new AppException("NGO registration number is required");
            }
            if (ngoRepository.existsByRegistrationNumber(req.getRegistrationNumber())) {
                throw new AppException("NGO registration number is already in use");
            }
        }

        User user = new User(
                req.getName(),
                req.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(req.getPassword()),
                req.getPhone(),
                req.getRole(),
                req.getAddress(),
                req.getLatitude() != null ? req.getLatitude() : 26.8467, // default Lucknow coordinates if not provided
                req.getLongitude() != null ? req.getLongitude() : 80.9462
        );

        User savedUser = userRepository.save(user);

        boolean isVerified = true;
        if (req.getRole() == Role.NGO) {
            // New NGO accounts require admin verification before accepting donations (FR-1.5)
            Ngo ngo = new Ngo(
                    savedUser,
                    req.getNgoName() != null ? req.getNgoName() : req.getName(),
                    req.getRegistrationNumber(),
                    req.getPhone(),
                    req.getAddress(),
                    false // Unverified initially
            );
            ngoRepository.save(ngo);
            isVerified = false;
        }

        UserDetailsImpl userDetails = new UserDetailsImpl(savedUser);
        String token = jwtUtil.generateToken(userDetails, savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                isVerified,
                savedUser.getPhone(),
                savedUser.getAddress(),
                savedUser.getLatitude(),
                savedUser.getLongitude()
        );
    }

    public AuthResponse login(AuthRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase().trim(), req.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        boolean verified = true;
        if (user.getRole() == Role.NGO) {
            verified = ngoRepository.findByUser(user)
                    .map(Ngo::getVerified)
                    .orElse(false);
        }

        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(
                token,
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
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
