package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.ActivityResponse;
import com.jobtrackai.jobtrack_backend.entity.Activity;
import com.jobtrackai.jobtrack_backend.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(
            ActivityService activityService
    ) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getRecentActivities() {

        List<ActivityResponse> activities =
                activityService
                        .getRecentActivities()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return ResponseEntity.ok(activities);
    }

    private ActivityResponse mapToResponse(
            Activity activity
    ) {
        return new ActivityResponse(
                activity.getId(),
                activity.getMessage(),
                activity.getType(),
                activity.getCreatedAt()
        );
    }
}