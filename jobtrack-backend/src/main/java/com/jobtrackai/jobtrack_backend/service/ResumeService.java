package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.ResumeResponse;
import com.jobtrackai.jobtrack_backend.entity.Resume;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ResumeRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository
    ) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
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

        if (originalFileName == null
                || originalFileName.trim().isEmpty()) {

            throw new RuntimeException("Invalid file name");
        }

        validateFileType(originalFileName);

        User currentUser = getCurrentUser();

        String storedFileName =
                UUID.randomUUID()
                        + "_"
                        + sanitizeFileName(originalFileName);

        String fileType = file.getContentType();

        if (fileType == null || fileType.trim().isEmpty()) {
            fileType = detectFileType(originalFileName);
        }

        try {

            Resume resume = new Resume(
                    title.trim(),
                    originalFileName,
                    storedFileName,
                    file.getBytes(),
                    fileType,
                    LocalDateTime.now(),
                    currentUser
            );

            Resume savedResume = resumeRepository.save(resume);

            return ResumeResponse.fromEntity(savedResume);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not read resume file",
                    e
            );
        }
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

        resumeRepository.delete(resume);
    }

    /*
     * Load a resume file from the database
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

        byte[] fileData = resume.getFileData();

        if (fileData == null || fileData.length == 0) {
            throw new RuntimeException("Resume file data not found");
        }

        /*
         * Override getFilename() so the controller can
         * use the original uploaded filename.
         */
        return new ByteArrayResource(fileData) {

            @Override
            public String getFilename() {
                return resume.getOriginalFileName();
            }
        };
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
                || authentication.getName() == null
                || authentication.getName().equals("anonymousUser")) {

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
     * Detect MIME type when MultipartFile does not provide one
     */
    private String detectFileType(String fileName) {

        String lowerCaseFileName =
                fileName.toLowerCase();

        if (lowerCaseFileName.endsWith(".pdf")) {
            return "application/pdf";
        }

        if (lowerCaseFileName.endsWith(".doc")) {
            return "application/msword";
        }

        if (lowerCaseFileName.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        return "application/octet-stream";
    }

    /*
     * Sanitize file name used for the internal stored name
     */
    private String sanitizeFileName(String fileName) {

        return fileName
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}