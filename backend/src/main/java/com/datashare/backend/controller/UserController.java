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
import com.datashare.backend.DTO.JwtResponse;
import com.datashare.backend.DTO.LoginRequest;
import com.datashare.backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
@Tag(name = "User Controller",description = "Gestion de la connexion et de l'inscription des utilisateurs")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @Operation(summary = "inscription des utilisateurs",description = "Permet à un utilisateur de créer un compte avec email et mot de passe")
    @ApiResponse(responseCode = "200",description = "Utilisateur créé avec succès")
    @ApiResponse(responseCode = "400",description = "Données invalides ou email déjà utilisé")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody SignupRequest request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }
    @Operation(summary = "Connexion utilisateur\"",description = "Authentifie l'utilisateur et retourne un token JWT")
    @ApiResponse(responseCode = "200",description = "Connexion réussie et JWT généré")
    @ApiResponse(responseCode = "400",description = "L'identifiants est invalides")
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtToken = userService.login(loginRequest);
        return ResponseEntity.ok(jwtToken);
    }
}