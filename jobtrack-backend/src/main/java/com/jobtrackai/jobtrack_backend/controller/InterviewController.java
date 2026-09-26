package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.InterviewRequest;
import com.jobtrackai.jobtrack_backend.dto.InterviewResponse;
import com.jobtrackai.jobtrack_backend.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    // =========================================================
    // CREATE INTERVIEW FOR AN APPLICATION
    // =========================================================

    @PostMapping("/application/{applicationId}")
    public ResponseEntity<InterviewResponse> createInterview(
            @PathVariable Long applicationId,
            @RequestBody InterviewRequest request
    ) {

        return ResponseEntity.ok(
                interviewService.createInterview(
                        applicationId,
                        request
                )
        );
    }


    // =========================================================
    // GET ALL INTERVIEWS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {

        return ResponseEntity.ok(
                interviewService.getAllInterviews()
        );
    }


    // =========================================================
    // GET INTERVIEW BY APPLICATION ID
    // =========================================================

    @GetMapping("/{applicationId}")
    public ResponseEntity<InterviewResponse> getInterview(
            @PathVariable Long applicationId
    ) {

        return ResponseEntity.ok(
                interviewService.getInterview(applicationId)
        );
    }


    // =========================================================
    // UPDATE INTERVIEW BY APPLICATION ID
    // =========================================================

    @PutMapping("/{applicationId}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long applicationId,
            @RequestBody InterviewRequest request
    ) {

        return ResponseEntity.ok(
                interviewService.updateInterview(
                        applicationId,
                        request
                )
        );
    }
}