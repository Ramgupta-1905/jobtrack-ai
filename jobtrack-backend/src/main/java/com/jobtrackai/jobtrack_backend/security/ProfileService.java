package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.ProfileRequest;
import com.jobtrackai.jobtrack_backend.dto.ProfileResponse;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile() {
        User user = getLoggedInUser();

        return convertToResponse(user);
    }

    public ProfileResponse updateProfile(ProfileRequest request) {
        User user = getLoggedInUser();

        // Personal Information
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());
        user.setState(request.getState());

        // Academic Information
        user.setCollege(request.getCollege());
        user.setDegree(request.getDegree());
        user.setBranch(request.getBranch());
        user.setGraduationYear(request.getGraduationYear());
        user.setCgpa(request.getCgpa());

        // About
        user.setBio(request.getBio());

        // Social and Portfolio Links
        user.setGithubUrl(request.getGithubUrl());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setLeetcodeUrl(request.getLeetcodeUrl());
        user.setGeeksforgeeksUrl(request.getGeeksforgeeksUrl());
        user.setPortfolioUrl(request.getPortfolioUrl());

        // Skills
        user.setSkills(
                request.getSkills() != null
                        ? request.getSkills()
                        : new ArrayList<>()
        );

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    private User getLoggedInUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found")
                );
    }

    private ProfileResponse convertToResponse(User user) {
        ProfileResponse response = new ProfileResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        // Personal Information
        response.setUsername(user.getUsername());
        response.setPhone(user.getPhone());
        response.setCity(user.getCity());
        response.setState(user.getState());

        // Academic Information
        response.setCollege(user.getCollege());
        response.setDegree(user.getDegree());
        response.setBranch(user.getBranch());
        response.setGraduationYear(user.getGraduationYear());
        response.setCgpa(user.getCgpa());

        // About
        response.setBio(user.getBio());

        // Social and Portfolio Links
        response.setGithubUrl(user.getGithubUrl());
        response.setLinkedinUrl(user.getLinkedinUrl());
        response.setLeetcodeUrl(user.getLeetcodeUrl());
        response.setGeeksforgeeksUrl(user.getGeeksforgeeksUrl());
        response.setPortfolioUrl(user.getPortfolioUrl());

        // Skills
        response.setSkills(
                user.getSkills() != null
                        ? user.getSkills()
                        : new ArrayList<>()
        );

        return response;
    }
}