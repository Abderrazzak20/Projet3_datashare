package com.datashare.backend.service;
import com.datashare.backend.DTO.SignupRequest;
import com.datashare.backend.Handler.BadRequestException;
import com.datashare.backend.Handler.NotFoundException;
import com.datashare.backend.Handler.UnauthorizedException;
import com.datashare.backend.DTO.LoginRequest;
import com.datashare.backend.DTO.JwtResponse;
import com.datashare.backend.entities.User;
import com.datashare.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        SignupRequest request = new SignupRequest();
        request.setEmail("mario@gmail.com");
        request.setPassword("pass123");

        when(userRepository.findByEmail("mario@gmail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("encodedPass");

        userService.register(request);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterAlreadyExists() {
        SignupRequest request = new SignupRequest();
        request.setEmail("mario@gmail.com");

        when(userRepository.findByEmail("mario@gmail.com")).thenReturn(Optional.of(new User()));

        Exception exception = assertThrows(BadRequestException.class, () -> userService.register(request));
        assertEquals("User already exists", exception.getMessage());
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("mario@gmail.com");
        request.setPassword("pass123");

        User user = new User();
        user.setEmail("mario@gmail.com");
        user.setPassword("encodedPass");

        when(userRepository.findByEmail("mario@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass123", "encodedPass")).thenReturn(true);
        when(jwtService.generateTokenRegister(user)).thenReturn("token123");

        JwtResponse response = userService.login(request);
        assertEquals("token123", response.getToken());
    }

    @Test
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("mario@gmail.com");
        request.setPassword("wrong");

        User user = new User();
        user.setEmail("mario@gmail.com");
        user.setPassword("encodedPass");

        when(userRepository.findByEmail("mario@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedPass")).thenReturn(false);

        Exception exception = assertThrows(UnauthorizedException.class, () -> userService.login(request));
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("mario@gmail.com");
        request.setPassword("pass123");

        when(userRepository.findByEmail("mario@gmail.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(NotFoundException.class, () -> userService.login(request));
        assertEquals("User not found", exception.getMessage());
    }
}