package com.jobtrackai.jobtrack_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false, unique = true)
    private String storedFileName;

    @Column(
            name = "file_data",
            nullable = false,
            columnDefinition = "bytea"
    )
    private byte[] fileData;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Resume() {
    }

    public Resume(
            String title,
            String originalFileName,
            String storedFileName,
            byte[] fileData,
            String fileType,
            LocalDateTime uploadedAt,
            User user
    ) {
        this.title = title;
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.fileData = fileData;
        this.fileType = fileType;
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

    public byte[] getFileData() {
        return fileData;
    }

    public String getFileType() {
        return fileType;
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

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public void setUser(User user) {
        this.user = user;
    }
}