package com.jobtrackai.jobtrack_backend.dto;

public class SettingsResponse {

    private boolean emailNotifications;
    private boolean interviewReminders;
    private boolean weeklySummary;
    private boolean productUpdates;

    private String aiResponseStyle;
    private String aiCommunicationTone;

    public SettingsResponse() {
    }

    public SettingsResponse(
            boolean emailNotifications,
            boolean interviewReminders,
            boolean weeklySummary,
            boolean productUpdates,
            String aiResponseStyle,
            String aiCommunicationTone
    ) {
        this.emailNotifications = emailNotifications;
        this.interviewReminders = interviewReminders;
        this.weeklySummary = weeklySummary;
        this.productUpdates = productUpdates;
        this.aiResponseStyle = aiResponseStyle;
        this.aiCommunicationTone = aiCommunicationTone;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isInterviewReminders() {
        return interviewReminders;
    }

    public void setInterviewReminders(boolean interviewReminders) {
        this.interviewReminders = interviewReminders;
    }

    public boolean isWeeklySummary() {
        return weeklySummary;
    }

    public void setWeeklySummary(boolean weeklySummary) {
        this.weeklySummary = weeklySummary;
    }

    public boolean isProductUpdates() {
        return productUpdates;
    }

    public void setProductUpdates(boolean productUpdates) {
        this.productUpdates = productUpdates;
    }

    public String getAiResponseStyle() {
        return aiResponseStyle;
    }

    public void setAiResponseStyle(String aiResponseStyle) {
        this.aiResponseStyle = aiResponseStyle;
    }

    public String getAiCommunicationTone() {
        return aiCommunicationTone;
    }

    public void setAiCommunicationTone(String aiCommunicationTone) {
        this.aiCommunicationTone = aiCommunicationTone;
    }
}