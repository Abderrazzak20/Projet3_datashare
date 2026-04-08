package com.datashare.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.datashare.backend.DTO.SignupRequest;
import com.datashare.backend.DTO.jwtResponse;
import com.datashare.backend.DTO.loginRequest;
import com.datashare.backend.service.UserService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody SignupRequest request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<jwtResponse> login(@Valid @RequestBody loginRequest loginRequest) {
        jwtResponse jwtToken = userService.login(loginRequest);
        return ResponseEntity.ok(jwtToken);
    }
}