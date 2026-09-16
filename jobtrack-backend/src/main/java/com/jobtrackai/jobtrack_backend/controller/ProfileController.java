package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.ProfileRequest;
import com.jobtrackai.jobtrack_backend.dto.ProfileResponse;
import com.jobtrackai.jobtrack_backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        ProfileResponse profile = profileService.getProfile();

        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody ProfileRequest request
    ) {
        ProfileResponse updatedProfile =
                profileService.updateProfile(request);

        return ResponseEntity.ok(updatedProfile);
    }
}