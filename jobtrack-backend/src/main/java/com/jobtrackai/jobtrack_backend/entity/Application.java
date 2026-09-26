package com.jobtrackai.jobtrack_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String jobType;

    @Column(nullable = false)
    private String workMode;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String source;

    private String jobLink;

    private String stipend;

    private String experience;

    @ElementCollection
    @CollectionTable(
            name = "application_skills",
            joinColumns = @JoinColumn(name = "application_id")
    )
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Application() {
    }

    public Application(
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
            String notes,
            User user
    ) {
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
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public String getRole() {
        return role;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getJobType() {
        return jobType;
    }

    public String getWorkMode() {
        return workMode;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public String getStatus() {
        return status;
    }

    public String getSource() {
        return source;
    }

    public String getJobLink() {
        return jobLink;
    }

    public String getStipend() {
        return stipend;
    }

    public String getExperience() {
        return experience;
    }

    public List<String> getSkills() {
        return skills;
    }

    public String getDescription() {
        return description;
    }

    public String getNotes() {
        return notes;
    }

    public User getUser() {
        return user;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setJobLink(String jobLink) {
        this.jobLink = jobLink;
    }

    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setUser(User user) {
        this.user = user;
    }
}