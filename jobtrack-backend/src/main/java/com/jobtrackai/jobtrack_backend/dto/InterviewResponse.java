package com.jobtrackai.jobtrack_backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class InterviewResponse {

    private Long id;

    private Long applicationId;

    private String company;

    private String role;

    private LocalDate interviewDate;

    private LocalTime interviewTime;

    private String interviewMode;
    private String interviewType;

    private String status;

    private String outcome;

    private String notes;

    public InterviewResponse() {
    }

    public InterviewResponse(
            Long id,
            Long applicationId,
            String company,
            String role,
            LocalDate interviewDate,
            LocalTime interviewTime,
            String interviewMode,
            String interviewType,
            String status,
            String outcome,
            String notes
    ) {
        this.id = id;
        this.applicationId = applicationId;
        this.company = company;
        this.role = role;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.interviewMode = interviewMode;
        this.interviewType = interviewType;
        this.status = status;
        this.outcome = outcome;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public String getCompany() {
        return company;
    }

    public String getRole() {
        return role;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public String getInterviewMode() {
        return interviewMode;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public String getStatus() {
        return status;
    }

    public String getOutcome() {
        return outcome;
    }

    public String getNotes() {
        return notes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public void setInterviewTime(LocalTime interviewTime) {
        this.interviewTime = interviewTime;
    }

    public void setInterviewMode(String interviewMode) {
        this.interviewMode = interviewMode;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}