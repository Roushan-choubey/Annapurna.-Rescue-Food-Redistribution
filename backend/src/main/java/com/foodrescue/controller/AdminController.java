package com.foodrescue.controller;

import com.foodrescue.dto.DashboardStatsDto;
import com.foodrescue.dto.DonationResponse;
import com.foodrescue.dto.UserDto;
import com.foodrescue.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers(@RequestParam(required = false) String search) {
        List<UserDto> users = adminService.getAllUsers(search);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserDto> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        Boolean isActive = body.getOrDefault("isActive", true);
        UserDto user = adminService.toggleUserStatus(id, isActive);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/ngos/pending")
    public ResponseEntity<List<UserDto>> getPendingNgos() {
        List<UserDto> ngos = adminService.getPendingNgos();
        return ResponseEntity.ok(ngos);
    }

    @PatchMapping("/ngos/{id}/verify")
    public ResponseEntity<UserDto> verifyNgo(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        Boolean verified = body.getOrDefault("verified", true);
        UserDto ngo = adminService.verifyNgo(id, verified);
        return ResponseEntity.ok(ngo);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/donations")
    public ResponseEntity<List<DonationResponse>> getAllDonations() {
        List<DonationResponse> list = adminService.getAllDonations();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false, defaultValue = "json") String format) {

        if ("csv".equalsIgnoreCase(format)) {
            String csvData = adminService.generateReportCsv(from, to);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"food_rescue_report.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csvData);
        }

        return ResponseEntity.ok(adminService.getAllDonations());
    }
}
