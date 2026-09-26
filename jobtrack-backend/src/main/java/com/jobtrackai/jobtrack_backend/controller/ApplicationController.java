package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.ApplicationRequest;
import com.jobtrackai.jobtrack_backend.dto.ApplicationResponse;
import com.jobtrackai.jobtrack_backend.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest request
    ) {
        ApplicationResponse response =
                applicationService.createApplication(request);

        return ResponseEntity.ok(response);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {

        return ResponseEntity.ok(
                applicationService.getAllApplications()
        );
    }

    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                applicationService.getApplication(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request
    ) {

        return ResponseEntity.ok(
                applicationService.updateApplication(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id
    ) {

        applicationService.deleteApplication(id);

        return ResponseEntity.noContent().build();
    }
}