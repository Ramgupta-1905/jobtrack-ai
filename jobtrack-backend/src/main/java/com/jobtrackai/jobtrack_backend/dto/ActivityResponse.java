package com.jobtrackai.jobtrack_backend.dto;

import java.time.LocalDateTime;

public class ActivityResponse {

    private Long id;
    private String message;
    private String type;
    private LocalDateTime createdAt;

    public ActivityResponse() {
    }

    public ActivityResponse(
            Long id,
            String message,
            String type,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}