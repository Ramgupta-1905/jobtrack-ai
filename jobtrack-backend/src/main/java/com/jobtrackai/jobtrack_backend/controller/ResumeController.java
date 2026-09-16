package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.ResumeResponse;
import com.jobtrackai.jobtrack_backend.service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /*
     * Upload a resume
     */
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file
    ) {

        ResumeResponse response =
                resumeService.uploadResume(title, file);

        return ResponseEntity.ok(response);
    }

    /*
     * Get all resumes of the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMyResumes() {

        List<ResumeResponse> resumes =
                resumeService.getMyResumes();

        return ResponseEntity.ok(resumes);
    }

    /*
     * Rename a resume
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> renameResume(
            @PathVariable("id") Long id,
            @RequestParam("title") String title
    ) {

        ResumeResponse response =
                resumeService.renameResume(id, title);

        return ResponseEntity.ok(response);
    }

    /*
     * Delete a resume
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable("id") Long id
    ) {

        resumeService.deleteResume(id);

        return ResponseEntity.noContent().build();
    }

    /*
     * Download/open a resume stored in the database
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> openResume(
            @PathVariable("id") Long id
    ) {

        Resource resource =
                resumeService.loadResumeFile(id);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(resource.getFilename() != null
                                ? resource.getFilename()
                                : "resume")
                        .build()
        );

        headers.setContentType(
                MediaType.APPLICATION_OCTET_STREAM
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}