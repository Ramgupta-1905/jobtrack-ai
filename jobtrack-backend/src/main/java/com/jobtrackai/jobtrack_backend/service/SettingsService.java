package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.SettingsRequest;
import com.jobtrackai.jobtrack_backend.dto.SettingsResponse;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SettingsService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get settings of logged-in user
    public SettingsResponse getSettings() {
        User user = getLoggedInUser();

        return new SettingsResponse(
                user.isEmailNotifications(),
                user.isInterviewReminders(),
                user.isWeeklySummary(),
                user.isProductUpdates(),
                user.getAiResponseStyle(),
                user.getAiCommunicationTone()
        );
    }

    // Update settings of logged-in user
    public SettingsResponse updateSettings(SettingsRequest request) {
        User user = getLoggedInUser();

        user.setEmailNotifications(request.isEmailNotifications());
        user.setInterviewReminders(request.isInterviewReminders());
        user.setWeeklySummary(request.isWeeklySummary());
        user.setProductUpdates(request.isProductUpdates());

        if (request.getAiResponseStyle() != null
                && !request.getAiResponseStyle().isBlank()) {
            user.setAiResponseStyle(request.getAiResponseStyle());
        }

        if (request.getAiCommunicationTone() != null
                && !request.getAiCommunicationTone().isBlank()) {
            user.setAiCommunicationTone(request.getAiCommunicationTone());
        }

        User savedUser = userRepository.save(user);

        return new SettingsResponse(
                savedUser.isEmailNotifications(),
                savedUser.isInterviewReminders(),
                savedUser.isWeeklySummary(),
                savedUser.isProductUpdates(),
                savedUser.getAiResponseStyle(),
                savedUser.getAiCommunicationTone()
        );
    }

    // Change password
    public void changePassword(
            String currentPassword,
            String newPassword
    ) {
        User user = getLoggedInUser();

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new RuntimeException("Current password is required.");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("New password is required.");
        }

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword()
        )) {
            throw new RuntimeException("Current password is incorrect.");
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "New password must be different from the current password."
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    // Get currently logged-in user
    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );
    }
}