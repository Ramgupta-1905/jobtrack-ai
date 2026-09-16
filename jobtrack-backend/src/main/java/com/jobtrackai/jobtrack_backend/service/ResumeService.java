package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.entity.Resume;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.ResumeRepository;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public Resume uploadResume(
            MultipartFile file,
            String title
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file cannot be empty");
        }

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Resume title is required");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new RuntimeException("Invalid file name");
        }

        String fileType = file.getContentType();

        if (!isAllowedFileType(fileType, originalFileName)) {
            throw new RuntimeException(
                    "Only PDF, DOC, and DOCX files are allowed"
            );
        }

        User currentUser = getCurrentUser();

        Resume resume = new Resume();

        resume.setTitle(title.trim());

        resume.setOriginalFileName(originalFileName);

        resume.setStoredFileName(
                UUID.randomUUID()
                        + "_"
                        + sanitizeFileName(originalFileName)
        );

        resume.setFileData(file.getBytes());

        resume.setFileType(
                detectFileType(fileType, originalFileName)
        );

        resume.setUploadedAt(LocalDateTime.now());

        resume.setUser(currentUser);

        return resumeRepository.save(resume);
    }

    public List<Resume> getMyResumes() {

        User currentUser = getCurrentUser();

        return resumeRepository.findByUserIdOrderByUploadedAtDesc(
                currentUser.getId()
        );
    }

    public Resume renameResume(
            Long resumeId,
            String newTitle
    ) {

        if (newTitle == null || newTitle.trim().isEmpty()) {
            throw new RuntimeException(
                    "Resume title cannot be empty"
            );
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

        return resumeRepository.save(resume);
    }

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
     * Loads the stored resume file for frontend preview.
     * The frontend receives the file as a Blob.
     */
    public ResumeFile loadResumeFile(Long resumeId) {

        User currentUser = getCurrentUser();

        Resume resume = resumeRepository
                .findByIdAndUserId(
                        resumeId,
                        currentUser.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Resume not found")
                );

        if (resume.getFileData() == null
                || resume.getFileData().length == 0) {

            throw new RuntimeException(
                    "Resume file data is empty"
            );
        }

        ByteArrayResource resource =
                new ByteArrayResource(
                        resume.getFileData()
                );

        String contentType = resume.getFileType();

        if (contentType == null
                || contentType.trim().isEmpty()) {

            contentType = detectFileType(
                    null,
                    resume.getOriginalFileName()
            );
        }

        return new ResumeFile(
                resource,
                resume.getOriginalFileName(),
                contentType
        );
    }

    private User getCurrentUser() {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );
    }

    private boolean isAllowedFileType(
            String contentType,
            String fileName
    ) {

        String lowerCaseFileName =
                fileName.toLowerCase();

        boolean validExtension =
                lowerCaseFileName.endsWith(".pdf")
                        || lowerCaseFileName.endsWith(".doc")
                        || lowerCaseFileName.endsWith(".docx");

        /*
         * Some browsers send application/octet-stream.
         * Therefore, extension is treated as the main validation.
         */
        boolean validContentType =
                contentType == null
                        || contentType.trim().isEmpty()
                        || "application/octet-stream".equalsIgnoreCase(
                        contentType
                )
                        || "application/pdf".equalsIgnoreCase(
                        contentType
                )
                        || "application/msword".equalsIgnoreCase(
                        contentType
                )
                        || "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        .equalsIgnoreCase(contentType);

        return validExtension && validContentType;
    }

    private String detectFileType(
            String contentType,
            String fileName
    ) {

        if (contentType != null
                && !contentType.trim().isEmpty()
                && !"application/octet-stream".equalsIgnoreCase(
                contentType
        )) {

            return contentType;
        }

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

    private String sanitizeFileName(
            String fileName
    ) {

        return fileName
                .replaceAll(
                        "[^a-zA-Z0-9._-]",
                        "_"
                );
    }

    public record ResumeFile(
            ByteArrayResource resource,
            String fileName,
            String contentType
    ) {
    }
}