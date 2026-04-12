package com.datashare.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import com.datashare.backend.entities.User;
import com.datashare.backend.repository.UserRepository;

public class JwtServiceTest {

	private JwtService jwtServ;
	private UserRepository userRepository;
	
	@BeforeEach
	void setup()throws Exception {
		userRepository = mock(UserRepository.class);
		jwtServ= new JwtService(userRepository);
		Field field=JwtService.class.getDeclaredField("SECRET_KEY");
		field.setAccessible(true);
		field.set(jwtServ, "mysecret1234567890AZERTYUIOPSDFGHJKLWXCVBN?NKIU");
		
	}
	@Test
	void testGenerateToken() {
		User user= new User();
		user.setId(1L);
		user.setEmail("Mario@gmail.com");
		UserDetails userDetails=org.springframework.security.core.userdetails.User
				.withUsername("Mario@gmail.com")
				.password("password")
				.authorities("USER")
				.build();
		
		when(userRepository.findByEmail("Mario@gmail.com")).thenReturn(Optional.of(user));
		String token=jwtServ.generateToken(userDetails);
		assertNotNull(token);			
	}
	@Test
	void testExtractLogin() {
		User user= new User();
		user.setId(1L);
		user.setEmail("mario@gmail.com");
		
		String token=jwtServ.generateTokenRegister(user);
		String login = jwtServ.extractLogin(token);
		assertEquals("Mario@gmail.com",login);
	}
	@Test
	void testTokenValid() {
		User user= new User();
		user.setId(1L);
		user.setEmail("Mario@gmail.com");
		String token = jwtServ.generateTokenRegister(user);
		boolean valid=jwtServ.isTokenValid(token, "Mario@gmail.com");
		assertTrue(valid);
	}
	
	@Test
	void testTokenInvalidLogin() {
		User user= new User();
		user.setId(1L);
		user.setEmail("Bad@gmail.com");
		String token = jwtServ.generateTokenRegister(user);
		boolean valid=jwtServ.isTokenValid(token, "Mario@gmail.com");
		assertFalse(valid);
	}

}
