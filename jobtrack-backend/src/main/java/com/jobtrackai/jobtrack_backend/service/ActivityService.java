package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.entity.Activity;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ActivityRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityService(
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public void createActivity(
            User user,
            String message,
            String type
    ) {
        Activity activity = new Activity(
                user,
                message,
                type
        );

        activityRepository.save(activity);
    }

    public List<Activity> getRecentActivities() {
        User user = getLoggedInUser();

        return activityRepository
                .findTop10ByUserIdOrderByCreatedAtDesc(user.getId());
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );
    }
}