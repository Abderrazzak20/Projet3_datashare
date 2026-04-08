package com.datashare.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.datashare.backend.DTO.SignupRequest;
import com.datashare.backend.DTO.jwtResponse;
import com.datashare.backend.DTO.loginRequest;
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

    // REGISTRAZIONE
    public void register(SignupRequest signupRequest) {
        Assert.notNull(signupRequest, "SignupRequest must not be null");
        log.info("Registering new user: {}", signupRequest.getLogin());

        // Controlla se l'utente esiste già
        if (userRepository.findByLogin(signupRequest.getLogin()).isPresent()) {
            throw new IllegalArgumentException("User with login " + signupRequest.getLogin() + " already exists");
        }

        // Crea e salva nuovo utente
        User user = new User();
        user.setLogin(signupRequest.getLogin());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        userRepository.save(user);
        log.info("User {} registered successfully", signupRequest.getLogin());
    }


    public jwtResponse login(loginRequest loginRequest) {
        Assert.notNull(loginRequest.getLogin(), "login must not be null");
        Assert.notNull(loginRequest.getPassword(), "Password must not be null");

        User dbUser = userRepository.findByLogin(loginRequest.getLogin())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

      
        if (!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

   
        String token = jwtService.generateTokenRegister(dbUser);
        log.info("User {} logged in successfully", dbUser.getLogin());

        return new jwtResponse(token);
    }
}