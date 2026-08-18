package com.jobtrackai.jobtrack_backend.dto;

public class MessageRequest {
    private String message;

    public void setMessage(String message){
        this.message = message;
    }
    public String getMessage(){
        return message;
    }
}
