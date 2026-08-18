package com.jobtrackai.jobtrack_backend.controller;

import com.jobtrackai.jobtrack_backend.dto.SignupRequest;
import com.jobtrackai.jobtrack_backend.dto.SignupResponse;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jobtrackai.jobtrack_backend.dto.LoginRequest;
import com.jobtrackai.jobtrack_backend.dto.LoginResponse;
import com.jobtrackai.jobtrack_backend.service.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    public final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public SignupResponse signup(@Valid @RequestBody SignupRequest request) {

        User user = userService.createUser(request);

        return new SignupResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
