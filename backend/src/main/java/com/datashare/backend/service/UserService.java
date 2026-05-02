package com.datashare.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.datashare.backend.DTO.SignupRequest;
import com.datashare.backend.Handler.BadRequestException;
import com.datashare.backend.Handler.NotFoundException;
import com.datashare.backend.Handler.UnauthorizedException;
import com.datashare.backend.DTO.JwtResponse;
import com.datashare.backend.DTO.LoginRequest;
import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.repository.UserFileRepository;
import com.datashare.backend.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final UserFileRepository fileRepository;

	public void register(SignupRequest signupRequest) {

	    log.info("Tentative d'inscription pour: {}", signupRequest.getEmail());

	    if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
	        throw new BadRequestException("User already exists");
	    }

	    User user = new User();
	    user.setEmail(signupRequest.getEmail());
	    user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

	    userRepository.save(user);

	    log.info("Utilisateur enregistré avec succès: {}", signupRequest.getEmail());
	}

	public JwtResponse login(LoginRequest loginRequest) {

	    log.info("Tentative de login pour: {}", loginRequest.getEmail());

	    User dbUser = userRepository.findByEmail(loginRequest.getEmail())
	            .orElseThrow(() -> new NotFoundException("User not found"));

	    if (!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
	        throw new UnauthorizedException("Invalid credentials");
	    }

	    String token = jwtService.generateTokenRegister(dbUser);

	    log.info("Login réussi pour: {}", dbUser.getEmail());

	    return new JwtResponse(token);
	}
	
	
}