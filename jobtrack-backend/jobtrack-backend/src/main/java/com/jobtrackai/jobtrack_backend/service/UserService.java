package com.jobtrackai.jobtrack_backend.service;

import com.jobtrackai.jobtrack_backend.dto.SignupRequest;
import com.jobtrackai.jobtrack_backend.entity.User;
import com.jobtrackai.jobtrack_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return user;
    }
}