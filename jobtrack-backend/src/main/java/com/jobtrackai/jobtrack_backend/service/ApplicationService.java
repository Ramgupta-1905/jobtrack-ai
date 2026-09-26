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
import java.util.stream.Collectors;

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

    // CREATE
    public ApplicationResponse createApplication(ApplicationRequest request) {

        User user = getLoggedInUser();

        boolean alreadyExists =
                applicationRepository.existsByCompanyIgnoreCaseAndRoleIgnoreCaseAndUserId(
                        request.getCompany(),
                        request.getRole(),
                        user.getId()
                );

        if (alreadyExists) {
            throw new RuntimeException(
                    "An application for this company and role already exists."
            );
        }

        Application application = new Application();

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
        application.setSkills(
                request.getSkills() != null
                        ? request.getSkills()
                        : List.of()
        );
        application.setDescription(request.getDescription());
        application.setNotes(request.getNotes());
        application.setUser(user);

        Application savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    // GET ALL APPLICATIONS FOR LOGGED-IN USER
    public List<ApplicationResponse> getAllApplications() {

        User user = getLoggedInUser();

        return applicationRepository
                .findByUserIdOrderByAppliedDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET ONE APPLICATION
    public ApplicationResponse getApplication(Long applicationId) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository.findByIdAndUserId(
                        applicationId,
                        user.getId()
                ).orElseThrow(() ->
                        new RuntimeException("Application not found.")
                );

        return mapToResponse(application);
    }

    // UPDATE
    public ApplicationResponse updateApplication(
            Long applicationId,
            ApplicationRequest request
    ) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository.findByIdAndUserId(
                        applicationId,
                        user.getId()
                ).orElseThrow(() ->
                        new RuntimeException("Application not found.")
                );

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
        application.setSkills(
                request.getSkills() != null
                        ? request.getSkills()
                        : List.of()
        );
        application.setDescription(request.getDescription());
        application.setNotes(request.getNotes());

        Application updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    // DELETE
    public void deleteApplication(Long applicationId) {

        User user = getLoggedInUser();

        Application application =
                applicationRepository.findByIdAndUserId(
                        applicationId,
                        user.getId()
                ).orElseThrow(() ->
                        new RuntimeException("Application not found.")
                );

        applicationRepository.delete(application);
    }

    // GET LOGGED-IN USER
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );
    }

    // ENTITY -> RESPONSE DTO
    private ApplicationResponse mapToResponse(
            Application application
    ) {

        return new ApplicationResponse(
                application.getId(),
                application.getCompany(),
                application.getRole(),
                application.getCity(),
                application.getState(),
                application.getJobType(),
                application.getWorkMode(),
                application.getAppliedDate(),
                application.getStatus(),
                application.getSource(),
                application.getJobLink(),
                application.getStipend(),
                application.getExperience(),
                application.getSkills(),
                application.getDescription(),
                application.getNotes()
        );
    }
}