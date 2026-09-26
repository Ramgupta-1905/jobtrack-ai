package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.ApplicationRequest;
import com.jobtrackai.jobtrack_backend.dto.ApplicationResponse;
import com.jobtrackai.jobtrack_backend.entity.Application;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ApplicationRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE APPLICATION
    // =========================================================

    public ApplicationResponse createApplication(ApplicationRequest request) {

        User user = getLoggedInUser();

        boolean duplicate =
                applicationRepository.existsByCompanyIgnoreCaseAndRoleIgnoreCaseAndUserId(
                        request.getCompany(),
                        request.getRole(),
                        user.getId()
                );

        if (duplicate) {
            throw new RuntimeException(
                    "An application for this company and role already exists."
            );
        }

        Application application = new Application(
                request.getCompany(),
                request.getRole(),
                request.getCity(),
                request.getState(),
                request.getJobType(),
                request.getWorkMode(),
                request.getAppliedDate(),
                request.getStatus(),
                request.getSource(),
                request.getJobLink(),
                request.getStipend(),
                request.getExperience(),
                request.getSkills(),
                request.getDescription(),
                request.getNotes(),
                user
        );

        /*
         * Only store interview data when the application
         * status is Interview Scheduled.
         */
        if ("Interview Scheduled".equalsIgnoreCase(request.getStatus())) {

            application.setInterviewDate(
                    request.getInterviewDate()
            );

            application.setInterviewTime(
                    request.getInterviewTime()
            );

            application.setInterviewType(
                    request.getInterviewType()
            );

            application.setInterviewStatus(
                    request.getInterviewStatus() != null
                            ? request.getInterviewStatus()
                            : "Scheduled"
            );

            application.setInterviewOutcome(
                    request.getInterviewOutcome() != null
                            ? request.getInterviewOutcome()
                            : "Pending"
            );

            application.setInterviewNotes(
                    request.getInterviewNotes()
            );

            validateInterviewDetails(application);
        } else {
            clearInterviewData(application);
        }

        Application savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }


    // =========================================================
    // GET ALL APPLICATIONS
    // =========================================================

    public List<ApplicationResponse> getAllApplications() {

        User user = getLoggedInUser();

        return applicationRepository
                .findByUserIdOrderByAppliedDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET SINGLE APPLICATION
    // =========================================================

    public ApplicationResponse getApplication(Long applicationId) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository
                        .findByIdAndUserId(
                                applicationId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        return mapToResponse(application);
    }


    // =========================================================
    // UPDATE APPLICATION
    // =========================================================

    public ApplicationResponse updateApplication(
            Long applicationId,
            ApplicationRequest request
    ) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository
                        .findByIdAndUserId(
                                applicationId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        // -----------------------------------------------------
        // Update normal application fields
        // -----------------------------------------------------

        application.setCompany(request.getCompany());
        application.setRole(request.getRole());
        application.setCity(request.getCity());
        application.setState(request.getState());
        application.setJobType(request.getJobType());
        application.setWorkMode(request.getWorkMode());
        application.setAppliedDate(request.getAppliedDate());
        application.setStatus(request.getStatus());
        application.setSource(request.getSource());
        application.setJobLink(request.getJobLink());
        application.setStipend(request.getStipend());
        application.setExperience(request.getExperience());
        application.setSkills(request.getSkills());
        application.setDescription(request.getDescription());
        application.setNotes(request.getNotes());


        // -----------------------------------------------------
        // Interview handling
        // -----------------------------------------------------

        if ("Interview Scheduled".equalsIgnoreCase(request.getStatus())) {

            /*
             * Application is still an interview application,
             * so keep/update the interview data.
             */

            application.setInterviewDate(
                    request.getInterviewDate()
            );

            application.setInterviewTime(
                    request.getInterviewTime()
            );

            application.setInterviewType(
                    request.getInterviewType()
            );

            application.setInterviewStatus(
                    request.getInterviewStatus() != null
                            ? request.getInterviewStatus()
                            : "Scheduled"
            );

            application.setInterviewOutcome(
                    request.getInterviewOutcome() != null
                            ? request.getInterviewOutcome()
                            : "Pending"
            );

            application.setInterviewNotes(
                    request.getInterviewNotes()
            );

            validateInterviewDetails(application);

        } else {

            /*
             * IMPORTANT:
             *
             * If the application is changed from
             * "Interview Scheduled" to ANY other status,
             * completely remove the interview data.
             */

            clearInterviewData(application);
        }


        Application updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }


    // =========================================================
    // DELETE APPLICATION
    // =========================================================

    public void deleteApplication(Long applicationId) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository
                        .findByIdAndUserId(
                                applicationId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        applicationRepository.delete(application);
    }


    // =========================================================
    // VALIDATE INTERVIEW DATA
    // =========================================================

    private void validateInterviewDetails(
            Application application
    ) {

        boolean interviewScheduled =
                "Interview Scheduled".equalsIgnoreCase(
                        application.getStatus()
                );

        if (!interviewScheduled) {
            return;
        }

        if (application.getInterviewDate() == null ||
                application.getInterviewTime() == null ||
                application.getInterviewType() == null ||
                application.getInterviewType().isBlank()) {

            throw new RuntimeException(
                    "Interview date, time and type are required."
            );
        }

        if (application.getInterviewStatus() == null ||
                application.getInterviewStatus().isBlank()) {

            application.setInterviewStatus("Scheduled");
        }

        if (application.getInterviewOutcome() == null ||
                application.getInterviewOutcome().isBlank()) {

            application.setInterviewOutcome("Pending");
        }
    }


    // =========================================================
    // CLEAR INTERVIEW DATA
    // =========================================================

    private void clearInterviewData(
            Application application
    ) {

        application.setInterviewDate(null);
        application.setInterviewTime(null);
        application.setInterviewType(null);
        application.setInterviewStatus(null);
        application.setInterviewOutcome(null);
        application.setInterviewNotes(null);
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
    // MAP APPLICATION → RESPONSE
    // =========================================================

    private ApplicationResponse mapToResponse(
            Application application
    ) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        response.setCompany(
                application.getCompany()
        );

        response.setRole(
                application.getRole()
        );

        response.setCity(
                application.getCity()
        );

        response.setState(
                application.getState()
        );

        response.setJobType(
                application.getJobType()
        );

        response.setWorkMode(
                application.getWorkMode()
        );

        response.setAppliedDate(
                application.getAppliedDate()
        );

        response.setStatus(
                application.getStatus()
        );

        response.setSource(
                application.getSource()
        );

        response.setJobLink(
                application.getJobLink()
        );

        response.setStipend(
                application.getStipend()
        );

        response.setExperience(
                application.getExperience()
        );

        response.setSkills(
                application.getSkills()
        );

        response.setDescription(
                application.getDescription()
        );

        response.setNotes(
                application.getNotes()
        );

        // Interview data

        response.setInterviewDate(
                application.getInterviewDate()
        );

        response.setInterviewTime(
                application.getInterviewTime()
        );

        response.setInterviewType(
                application.getInterviewType()
        );

        response.setInterviewStatus(
                application.getInterviewStatus()
        );

        response.setInterviewOutcome(
                application.getInterviewOutcome()
        );

        response.setInterviewNotes(
                application.getInterviewNotes()
        );

        return response;
    }
}