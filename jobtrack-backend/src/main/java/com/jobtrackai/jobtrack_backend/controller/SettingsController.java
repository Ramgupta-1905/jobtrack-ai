package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.SettingsRequest;
import com.jobtrackai.jobtrack_backend.dto.SettingsResponse;
import com.jobtrackai.jobtrack_backend.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // Get saved settings
    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings() {
        return ResponseEntity.ok(
                settingsService.getSettings()
        );
    }

    // Update notification + AI preferences
    @PutMapping
    public ResponseEntity<SettingsResponse> updateSettings(
            @RequestBody SettingsRequest request
    ) {
        return ResponseEntity.ok(
                settingsService.updateSettings(request)
        );
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        settingsService.changePassword(
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                "Password updated successfully."
        );
    }

    // Request DTO for password change
    public static class ChangePasswordRequest {

        private String currentPassword;
        private String newPassword;

        public ChangePasswordRequest() {
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}