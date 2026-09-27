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

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            ActivityService activityService
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.activityService = activityService;
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

        // -----------------------------------------------------
        // Interview handling
        // -----------------------------------------------------

        if ("Interview Scheduled".equalsIgnoreCase(request.getStatus())) {

            application.setInterviewDate(
                    request.getInterviewDate()
            );

            application.setInterviewTime(
                    request.getInterviewTime()
            );

            application.setInterviewMode(
                    request.getInterviewMode()
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

        // -----------------------------------------------------
        // Assessment handling
        // -----------------------------------------------------

        if ("Assessment".equalsIgnoreCase(request.getStatus())) {

            application.setAssessmentDate(
                    request.getAssessmentDate()
            );

            application.setAssessmentType(
                    request.getAssessmentType()
            );

            application.setDeadlineDate(
                    request.getDeadlineDate()
            );

            validateAssessmentDetails(application);

        } else {
            clearAssessmentData(application);
        }

        Application savedApplication =
                applicationRepository.save(application);

        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        activityService.createActivity(
                user,
                "Applied to " + savedApplication.getCompany(),
                "application"
        );

        // Interview activity
        if (savedApplication.getInterviewDate() != null) {

            activityService.createActivity(
                    user,
                    "Scheduled an interview with "
                            + savedApplication.getCompany(),
                    "interview"
            );
        }

        // Assessment activity
        if ("Assessment".equalsIgnoreCase(
                savedApplication.getStatus()
        )) {

            String assessmentMessage =
                    savedApplication.getAssessmentType() != null
                            && !savedApplication
                            .getAssessmentType()
                            .isBlank()
                            ? "Added a "
                            + savedApplication
                            .getAssessmentType()
                            + " assessment for "
                            + savedApplication.getCompany()
                            : "Added an assessment for "
                            + savedApplication.getCompany();

            activityService.createActivity(
                    user,
                    assessmentMessage,
                    "assessment"
            );
        }

        // Deadline activity
        if (
                "Assessment".equalsIgnoreCase(
                        savedApplication.getStatus()
                )
                        &&
                        savedApplication.getDeadlineDate() != null
        ) {

            activityService.createActivity(
                    user,
                    "Added an assessment deadline for "
                            + savedApplication.getCompany(),
                    "deadline"
            );
        }

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
        // Store old values BEFORE making changes
        // -----------------------------------------------------

        String oldCompany = application.getCompany();
        String oldRole = application.getRole();
        String oldStatus = application.getStatus();

        boolean hadInterview =
                application.getInterviewDate() != null;

        String oldInterviewDate =
                application.getInterviewDate() != null
                        ? application.getInterviewDate().toString()
                        : null;

        String oldInterviewTime =
                application.getInterviewTime() != null
                        ? application.getInterviewTime().toString()
                        : null;

        String oldInterviewMode =
                application.getInterviewMode();

        String oldInterviewType =
                application.getInterviewType();

        LocalDate oldAssessmentDate =
                application.getAssessmentDate();

        String oldAssessmentType =
                application.getAssessmentType();

        LocalDate oldDeadlineDate =
                application.getDeadlineDate();

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

        if ("Interview Scheduled".equalsIgnoreCase(
                request.getStatus()
        )) {

            application.setInterviewDate(
                    request.getInterviewDate()
            );

            application.setInterviewTime(
                    request.getInterviewTime()
            );

            application.setInterviewMode(
                    request.getInterviewMode()
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

        // -----------------------------------------------------
        // Assessment handling
        // -----------------------------------------------------

        if ("Assessment".equalsIgnoreCase(
                request.getStatus()
        )) {

            application.setAssessmentDate(
                    request.getAssessmentDate()
            );

            application.setAssessmentType(
                    request.getAssessmentType()
            );

            application.setDeadlineDate(
                    request.getDeadlineDate()
            );

            validateAssessmentDetails(application);

        } else {
            clearAssessmentData(application);
        }

        Application updatedApplication =
                applicationRepository.save(application);

        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        boolean statusChanged =
                !equalsIgnoreCase(
                        oldStatus,
                        updatedApplication.getStatus()
                );

        boolean companyChanged =
                !equalsIgnoreCase(
                        oldCompany,
                        updatedApplication.getCompany()
                );

        boolean roleChanged =
                !equalsIgnoreCase(
                        oldRole,
                        updatedApplication.getRole()
                );

        boolean otherApplicationDetailsChanged =
                companyChanged || roleChanged;

        // Status changed
        if (statusChanged) {

            activityService.createActivity(
                    user,
                    "Updated "
                            + updatedApplication.getCompany()
                            + " application status to "
                            + updatedApplication.getStatus(),
                    "application"
            );
        }

        // Other application details changed
        if (otherApplicationDetailsChanged) {

            activityService.createActivity(
                    user,
                    "Updated "
                            + updatedApplication.getCompany()
                            + " application",
                    "application"
            );
        }

        // -----------------------------------------------------
        // Interview activity
        // -----------------------------------------------------

        boolean hasInterview =
                updatedApplication.getInterviewDate() != null;

        // Interview was newly added
        if (!hadInterview && hasInterview) {

            activityService.createActivity(
                    user,
                    "Scheduled an interview with "
                            + updatedApplication.getCompany(),
                    "interview"
            );
        }

        // Existing interview was edited
        boolean interviewChanged =
                hadInterview &&
                        hasInterview &&
                        (
                                !equalsIgnoreCase(
                                        oldInterviewDate,
                                        updatedApplication
                                                .getInterviewDate() != null
                                                ? updatedApplication
                                                .getInterviewDate()
                                                .toString()
                                                : null
                                )
                                        ||
                                        !equalsIgnoreCase(
                                                oldInterviewTime,
                                                updatedApplication
                                                        .getInterviewTime() != null
                                                        ? updatedApplication
                                                        .getInterviewTime()
                                                        .toString()
                                                        : null
                                        )
                                        ||
                                        !equalsIgnoreCase(
                                                oldInterviewMode,
                                                updatedApplication
                                                        .getInterviewMode()
                                        )
                                        ||
                                        !equalsIgnoreCase(
                                                oldInterviewType,
                                                updatedApplication
                                                        .getInterviewType()
                                        )
                        );

        if (interviewChanged) {

            activityService.createActivity(
                    user,
                    "Updated the interview with "
                            + updatedApplication.getCompany(),
                    "interview"
            );
        }

        // -----------------------------------------------------
        // Assessment activity
        // -----------------------------------------------------

        boolean isAssessment =
                "Assessment".equalsIgnoreCase(
                        updatedApplication.getStatus()
                );

        boolean hadAssessment =
                oldAssessmentDate != null;

        boolean hasAssessment =
                isAssessment &&
                        updatedApplication.getAssessmentDate() != null;

        boolean assessmentAdded =
                !hadAssessment &&
                        hasAssessment;

        boolean assessmentChanged =
                hadAssessment &&
                        hasAssessment &&
                        (
                                !oldAssessmentDate.equals(
                                        updatedApplication
                                                .getAssessmentDate()
                                )
                                        ||
                                        !equalsIgnoreCase(
                                                oldAssessmentType,
                                                updatedApplication
                                                        .getAssessmentType()
                                        )
                        );

        if (assessmentAdded) {

            String assessmentMessage =
                    updatedApplication.getAssessmentType() != null
                            && !updatedApplication
                            .getAssessmentType()
                            .isBlank()
                            ? "Added a "
                            + updatedApplication
                            .getAssessmentType()
                            + " assessment for "
                            + updatedApplication.getCompany()
                            : "Added an assessment for "
                            + updatedApplication.getCompany();

            activityService.createActivity(
                    user,
                    assessmentMessage,
                    "assessment"
            );

        } else if (assessmentChanged) {

            activityService.createActivity(
                    user,
                    "Updated the assessment for "
                            + updatedApplication.getCompany(),
                    "assessment"
            );
        }

        // -----------------------------------------------------
        // Deadline activity
        // -----------------------------------------------------

        boolean hasDeadline =
                isAssessment &&
                        updatedApplication.getDeadlineDate() != null;

        boolean deadlineAdded =
                oldDeadlineDate == null &&
                        hasDeadline;

        boolean deadlineChanged =
                oldDeadlineDate != null &&
                        hasDeadline &&
                        !oldDeadlineDate.equals(
                                updatedApplication.getDeadlineDate()
                        );

        if (deadlineAdded) {

            activityService.createActivity(
                    user,
                    "Added an assessment deadline for "
                            + updatedApplication.getCompany(),
                    "deadline"
            );

        } else if (deadlineChanged) {

            activityService.createActivity(
                    user,
                    "Updated the assessment deadline for "
                            + updatedApplication.getCompany(),
                    "deadline"
            );
        }

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

        String company = application.getCompany();

        applicationRepository.delete(application);

        activityService.createActivity(
                user,
                "Deleted " + company + " application",
                "application"
        );
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
                application.getInterviewMode() == null ||
                application.getInterviewMode().isBlank() ||
                application.getInterviewType() == null ||
                application.getInterviewType().isBlank()) {

            throw new RuntimeException(
                    "Interview date, time, mode and type are required."
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
    // VALIDATE ASSESSMENT DATA
    // =========================================================

    private void validateAssessmentDetails(
            Application application
    ) {

        boolean assessmentStatus =
                "Assessment".equalsIgnoreCase(
                        application.getStatus()
                );

        if (!assessmentStatus) {
            return;
        }

        if (application.getAssessmentType() == null ||
                application.getAssessmentType().isBlank() ||
                application.getAssessmentDate() == null) {

            throw new RuntimeException(
                    "Assessment type and assessment date are required."
            );
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
        application.setInterviewMode(null);
        application.setInterviewType(null);
        application.setInterviewStatus(null);
        application.setInterviewOutcome(null);
        application.setInterviewNotes(null);
    }


    // =========================================================
    // CLEAR ASSESSMENT DATA
    // =========================================================

    private void clearAssessmentData(
            Application application
    ) {

        application.setAssessmentDate(null);
        application.setAssessmentType(null);
        application.setDeadlineDate(null);
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
    // STRING COMPARISON
    // =========================================================

    private boolean equalsIgnoreCase(
            String first,
            String second
    ) {

        if (first == null && second == null) {
            return true;
        }

        if (first == null || second == null) {
            return false;
        }

        return first.equalsIgnoreCase(second);
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

        response.setInterviewMode(
                application.getInterviewMode()
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

        // Assessment data

        response.setAssessmentDate(
                application.getAssessmentDate()
        );

        response.setAssessmentType(
                application.getAssessmentType()
        );

        // Assessment Deadline

        response.setDeadlineDate(
                application.getDeadlineDate()
        );

        return response;
    }
}