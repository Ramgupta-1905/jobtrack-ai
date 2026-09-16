package com.jobtrackai.jobtrack_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Title entered by the user
    @Column(nullable = false)
    private String title;

    // Original file name selected by the user
    @Column(nullable = false)
    private String originalFileName;

    // Unique name used internally on the server
    @Column(nullable = false, unique = true)
    private String storedFileName;

    // Internal location of the uploaded file
    @Column(nullable = false)
    private String filePath;

    // Upload date shown on the frontend
    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    // Resume owner
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Resume() {
    }

    public Resume(
            String title,
            String originalFileName,
            String storedFileName,
            String filePath,
            LocalDateTime uploadedAt,
            User user
    ) {
        this.title = title;
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
        this.user = user;
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

    public String getStoredFileName() {
        return storedFileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public User getUser() {
        return user;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public void setUser(User user) {
        this.user = user;
    }
}