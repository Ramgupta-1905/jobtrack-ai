package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.MessageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello(@RequestParam String name){
        return "Hello " + name;
    }

    @PostMapping("/hello")
    public String helloPost(@RequestBody MessageRequest request) {
        return "Backend received: " + request.getMessage();
    }

}
