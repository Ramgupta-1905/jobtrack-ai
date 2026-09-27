package com.jobtrackai.jobtrack_backend.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Personal Information
    private String username;

    private String phone;

    private String city;

    private String state;

    // Academic Information
    private String college;

    private String degree;

    private String branch;

    private Integer graduationYear;

    private Double cgpa;

    // About
    @Column(length = 1000)
    private String bio;

    // Social and Portfolio Links
    private String githubUrl;

    private String linkedinUrl;

    private String leetcodeUrl;

    private String geeksforgeeksUrl;

    private String portfolioUrl;

    // Skills
    @ElementCollection
    @CollectionTable(
            name = "user_skills",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    // Notification Preferences
    @Column(nullable = false)
    private boolean emailNotifications = false;

    @Column(nullable = false)
    private boolean interviewReminders = true;

    @Column(nullable = false)
    private boolean weeklySummary = true;

    @Column(nullable = false)
    private boolean productUpdates = false;

    // AI Preferences
    @Column(nullable = false)
    private String aiResponseStyle = "Balanced";

    @Column(nullable = false)
    private String aiCommunicationTone = "Professional";

    public User() {
    }

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getCollege() {
        return college;
    }

    public String getDegree() {
        return degree;
    }

    public String getBranch() {
        return branch;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public String getBio() {
        return bio;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getLeetcodeUrl() {
        return leetcodeUrl;
    }

    public String getGeeksforgeeksUrl() {
        return geeksforgeeksUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public List<String> getSkills() {
        return skills;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public boolean isInterviewReminders() {
        return interviewReminders;
    }

    public boolean isWeeklySummary() {
        return weeklySummary;
    }

    public boolean isProductUpdates() {
        return productUpdates;
    }

    public String getAiResponseStyle() {
        return aiResponseStyle;
    }

    public String getAiCommunicationTone() {
        return aiCommunicationTone;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public void setLeetcodeUrl(String leetcodeUrl) {
        this.leetcodeUrl = leetcodeUrl;
    }

    public void setGeeksforgeeksUrl(String geeksforgeeksUrl) {
        this.geeksforgeeksUrl = geeksforgeeksUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public void setInterviewReminders(boolean interviewReminders) {
        this.interviewReminders = interviewReminders;
    }

    public void setWeeklySummary(boolean weeklySummary) {
        this.weeklySummary = weeklySummary;
    }

    public void setProductUpdates(boolean productUpdates) {
        this.productUpdates = productUpdates;
    }

    public void setAiResponseStyle(String aiResponseStyle) {
        this.aiResponseStyle = aiResponseStyle;
    }

    public void setAiCommunicationTone(String aiCommunicationTone) {
        this.aiCommunicationTone = aiCommunicationTone;
    }
}