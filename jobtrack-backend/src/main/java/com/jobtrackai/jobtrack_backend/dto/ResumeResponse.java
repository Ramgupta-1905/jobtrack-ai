package com.jobtrackai.jobtrack_backend.dto;

import com.jobtrackai.jobtrack_backend.entity.Resume;

import java.time.LocalDateTime;

public class ResumeResponse {

    private Long id;
    private String title;
    private String originalFileName;
    private LocalDateTime uploadedAt;

    public ResumeResponse() {
    }

    public ResumeResponse(
            Long id,
            String title,
            String originalFileName,
            LocalDateTime uploadedAt
    ) {
        this.id = id;
        this.title = title;
        this.originalFileName = originalFileName;
        this.uploadedAt = uploadedAt;
    }

    public static ResumeResponse fromEntity(Resume resume) {

        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getOriginalFileName(),
                resume.getUploadedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}