package com.datashare.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.datashare.backend.DTO.SignupRequest;
import com.datashare.backend.DTO.JwtResponse;
import com.datashare.backend.DTO.LoginRequest;
import com.datashare.backend.entities.User;
import com.datashare.backend.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public void register(SignupRequest signupRequest) {
		Assert.notNull(signupRequest, "SignupRequest must not be null");
		log.info("Tentative d'inscription pour: {}", signupRequest.getEmail());

		if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
			log.warn("Échec inscription - utilisateur déjà existant: {}", signupRequest.getEmail());
			throw new IllegalArgumentException("User with login " + signupRequest.getEmail() + " already exists");
		}

		User user = new User();
		user.setEmail(signupRequest.getEmail());
		user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
		userRepository.save(user);
		log.info("Utilisateur enregistré avec succès: {}", signupRequest.getEmail());
	}

	public JwtResponse login(LoginRequest loginRequest) {

		log.info("Tentative de login pour: {}", loginRequest.getEmail());

		User dbUser = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> {
			log.warn("Login échoué - utilisateur introuvable: {}", loginRequest.getEmail());
			return new IllegalArgumentException("Invalid credentials");
		});

		if (!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
			log.warn("Login échoué - mot de passe incorrect pour: {}", loginRequest.getEmail());
			throw new IllegalArgumentException("Invalid credentials");
		}

		String token = jwtService.generateTokenRegister(dbUser);

		log.info("Login réussi pour: {}", dbUser.getEmail());

		return new JwtResponse(token);
	}
}