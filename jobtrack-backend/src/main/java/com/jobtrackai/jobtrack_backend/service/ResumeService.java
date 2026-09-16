package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.ResumeResponse;
import com.jobtrackai.jobtrack_backend.entity.Resume;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ResumeRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/resumes").toAbsolutePath().normalize();

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository
    ) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create resume upload directory",
                    e
            );
        }
    }

    /*
     * Upload a new resume
     */
    public ResumeResponse uploadResume(
            String title,
            MultipartFile file
    ) {

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Resume title is required");
        }

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a resume file");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new RuntimeException("Invalid file name");
        }

        validateFileType(originalFileName);

        User currentUser = getCurrentUser();

        String storedFileName =
                UUID.randomUUID() + "_" + sanitizeFileName(originalFileName);

        Path targetLocation =
                uploadDirectory.resolve(storedFileName);

        try {
            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not save resume file",
                    e
            );
        }

        Resume resume = new Resume(
                title.trim(),
                originalFileName,
                storedFileName,
                targetLocation.toString(),
                LocalDateTime.now(),
                currentUser
        );

        Resume savedResume = resumeRepository.save(resume);

        return ResumeResponse.fromEntity(savedResume);
    }

    /*
     * Get only the current user's resumes
     */
    public List<ResumeResponse> getMyResumes() {

        User currentUser = getCurrentUser();

        return resumeRepository
                .findByUserIdOrderByUploadedAtDesc(currentUser.getId())
                .stream()
                .map(ResumeResponse::fromEntity)
                .toList();
    }

    /*
     * Rename a resume owned by the current user
     */
    public ResumeResponse renameResume(
            Long resumeId,
            String newTitle
    ) {

        if (newTitle == null || newTitle.trim().isEmpty()) {
            throw new RuntimeException("Resume title is required");
        }

        User currentUser = getCurrentUser();

        Resume resume = resumeRepository
                .findByIdAndUserId(
                        resumeId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Resume not found")
                );

        resume.setTitle(newTitle.trim());

        Resume updatedResume = resumeRepository.save(resume);

        return ResumeResponse.fromEntity(updatedResume);
    }

    /*
     * Delete a resume owned by the current user
     */
    public void deleteResume(Long resumeId) {

        User currentUser = getCurrentUser();

        Resume resume = resumeRepository
                .findByIdAndUserId(
                        resumeId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Resume not found")
                );

        try {
            Path filePath = Paths.get(resume.getFilePath());

            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not delete resume file",
                    e
            );
        }

        resumeRepository.delete(resume);
    }

    /*
     * Load a resume file for download/opening
     */
    public Resource loadResumeFile(Long resumeId) {

        User currentUser = getCurrentUser();

        Resume resume = resumeRepository
                .findByIdAndUserId(
                        resumeId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Resume not found")
                );

        try {
            Path filePath = Paths
                    .get(resume.getFilePath())
                    .toAbsolutePath()
                    .normalize();

            Resource resource = new UrlResource(
                    filePath.toUri()
            );

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Resume file not found");
            }

            return resource;

        } catch (MalformedURLException e) {
            throw new RuntimeException(
                    "Could not load resume file",
                    e
            );
        }
    }

    /*
     * Get the currently authenticated user
     */
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    /*
     * Allow only resume-related file formats
     */
    private void validateFileType(String fileName) {

        String lowerCaseFileName =
                fileName.toLowerCase();

        boolean validFile =
                lowerCaseFileName.endsWith(".pdf")
                        || lowerCaseFileName.endsWith(".doc")
                        || lowerCaseFileName.endsWith(".docx");

        if (!validFile) {
            throw new RuntimeException(
                    "Only PDF, DOC, and DOCX files are allowed"
            );
        }
    }

    /*
     * Prevent unsafe file names
     */
    private String sanitizeFileName(String fileName) {

        return Paths
                .get(fileName)
                .getFileName()
                .toString()
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}