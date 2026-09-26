package com.jobtrackai.jobtrack_backend.dto;

import java.time.LocalDate;
import java.util.List;

public class ApplicationResponse {

    private Long id;
    private String company;
    private String role;
    private String city;
    private String state;
    private String jobType;
    private String workMode;
    private LocalDate appliedDate;
    private String status;
    private String source;
    private String jobLink;
    private String stipend;
    private String experience;
    private List<String> skills;
    private String description;
    private String notes;

    public ApplicationResponse() {
    }

    public ApplicationResponse(
            Long id,
            String company,
            String role,
            String city,
            String state,
            String jobType,
            String workMode,
            LocalDate appliedDate,
            String status,
            String source,
            String jobLink,
            String stipend,
            String experience,
            List<String> skills,
            String description,
            String notes
    ) {
        this.id = id;
        this.company = company;
        this.role = role;
        this.city = city;
        this.state = state;
        this.jobType = jobType;
        this.workMode = workMode;
        this.appliedDate = appliedDate;
        this.status = status;
        this.source = source;
        this.jobLink = jobLink;
        this.stipend = stipend;
        this.experience = experience;
        this.skills = skills;
        this.description = description;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getJobLink() {
        return jobLink;
    }

    public void setJobLink(String jobLink) {
        this.jobLink = jobLink;
    }

    public String getStipend() {
        return stipend;
    }

    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}