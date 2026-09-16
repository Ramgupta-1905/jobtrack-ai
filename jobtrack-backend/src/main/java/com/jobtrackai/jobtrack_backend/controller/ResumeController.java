package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.ResumeResponse;
import com.jobtrackai.jobtrack_backend.entity.Resume;
import com.jobtrackai.jobtrack_backend.service.ResumeService;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title
    ) throws IOException {

        Resume savedResume =
                resumeService.uploadResume(file, title);

        return ResponseEntity.ok(
                ResumeResponse.fromEntity(savedResume)
        );
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMyResumes() {

        List<ResumeResponse> resumes =
                resumeService.getMyResumes()
                        .stream()
                        .map(ResumeResponse::fromEntity)
                        .toList();

        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> renameResume(
            @PathVariable Long id,
            @RequestParam("title") String title
    ) {

        Resume updatedResume =
                resumeService.renameResume(id, title);

        return ResponseEntity.ok(
                ResumeResponse.fromEntity(updatedResume)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id
    ) {

        resumeService.deleteResume(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> viewResume(
            @PathVariable Long id
    ) {

        ResumeService.ResumeFile resumeFile =
                resumeService.loadResumeFile(id);

        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(
                    resumeFile.contentType()
            );
        } catch (Exception exception) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        ContentDisposition contentDisposition =
                ContentDisposition
                        .inline()
                        .filename(resumeFile.fileName())
                        .build();

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        contentDisposition.toString()
                )
                .body(resumeFile.resource());
    }
}