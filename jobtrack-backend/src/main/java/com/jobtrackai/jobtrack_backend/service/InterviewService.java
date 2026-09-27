package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.InterviewRequest;
import com.jobtrackai.jobtrack_backend.dto.InterviewResponse;
import com.jobtrackai.jobtrack_backend.entity.Application;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ApplicationRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    public InterviewService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            ActivityService activityService
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.activityService = activityService;
    }

    // =========================================================
    // CREATE / ADD INTERVIEW
    // =========================================================

    public InterviewResponse createInterview(
            Long applicationId,
            InterviewRequest request
    ) {

        User user = getLoggedInUser();

        Application application = applicationRepository
                .findByIdAndUserId(
                        applicationId,
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found."
                        )
                );

        // Make sure this application does not already have interview data
        if (application.getInterviewDate() != null) {
            throw new RuntimeException(
                    "An interview already exists for this application."
            );
        }

        application.setInterviewDate(
                request.getInterviewDate()
        );

        application.setInterviewTime(
                request.getInterviewTime()
        );

        application.setInterviewType(
                request.getType()
        );

        application.setInterviewStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : "Scheduled"
        );

        application.setInterviewOutcome(
                request.getOutcome() != null
                        ? request.getOutcome()
                        : "Pending"
        );

        application.setInterviewNotes(
                request.getNotes()
        );

        // Application status must represent that an interview exists
        application.setStatus(
                "Interview Scheduled"
        );

        Application savedApplication =
                applicationRepository.save(application);

        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        activityService.createActivity(
                user,
                "Scheduled an interview with "
                        + savedApplication.getCompany(),
                "interview"
        );

        return mapToResponse(savedApplication);
    }


    // =========================================================
    // GET ALL INTERVIEWS
    // =========================================================

    public List<InterviewResponse> getAllInterviews() {

        User user = getLoggedInUser();

        return applicationRepository
                .findByUserIdOrderByAppliedDateDesc(
                        user.getId()
                )
                .stream()
                .filter(application ->
                        application.getInterviewDate() != null
                )
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET SINGLE INTERVIEW
    // =========================================================

    public InterviewResponse getInterview(
            Long interviewId
    ) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository
                        .findByIdAndUserId(
                                interviewId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        if (application.getInterviewDate() == null) {
            throw new RuntimeException(
                    "Interview not found for this application."
            );
        }

        return mapToResponse(application);
    }


    // =========================================================
    // UPDATE INTERVIEW
    // =========================================================

    public InterviewResponse updateInterview(
            Long interviewId,
            InterviewRequest request
    ) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository
                        .findByIdAndUserId(
                                interviewId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        if (application.getInterviewDate() == null) {
            throw new RuntimeException(
                    "Interview not found for this application."
            );
        }

        application.setInterviewDate(
                request.getInterviewDate()
        );

        application.setInterviewTime(
                request.getInterviewTime()
        );

        application.setInterviewType(
                request.getType()
        );

        application.setInterviewStatus(
                request.getStatus()
        );

        application.setInterviewOutcome(
                request.getOutcome()
        );

        application.setInterviewNotes(
                request.getNotes()
        );

        Application updatedApplication =
                applicationRepository.save(application);

        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        activityService.createActivity(
                user,
                "Updated the interview with "
                        + updatedApplication.getCompany(),
                "interview"
        );

        return mapToResponse(updatedApplication);
    }


    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

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


    // =========================================================
    // MAP APPLICATION → INTERVIEW RESPONSE
    // =========================================================

    private InterviewResponse mapToResponse(
            Application application
    ) {

        InterviewResponse response =
                new InterviewResponse();

        /*
         * IMPORTANT:
         *
         * Interview ID is now the Application ID because
         * interview information lives inside Application.
         */
        response.setId(
                application.getId()
        );

        response.setApplicationId(
                application.getId()
        );

        response.setCompany(
                application.getCompany()
        );

        response.setRole(
                application.getRole()
        );

        response.setInterviewDate(
                application.getInterviewDate()
        );

        response.setInterviewTime(
                application.getInterviewTime()
        );

        response.setType(
                application.getInterviewType()
        );

        response.setStatus(
                application.getInterviewStatus()
        );

        response.setOutcome(
                application.getInterviewOutcome()
        );

        response.setNotes(
                application.getInterviewNotes()
        );

        return response;
    }
}