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
		field.set(jwtServ, "mysecretkeymysecretkeymysecretkey12");
		
	}
	@Test
	void testGenerateToken() {
		User user= new User();
		user.setId(1L);
		user.setLogin("Mario");
		UserDetails userDetails=org.springframework.security.core.userdetails.User
				.withUsername("Mario")
				.password("password")
				.authorities("USER")
				.build();
		
		when(userRepository.findByLogin("Mario")).thenReturn(Optional.of(user));
		String token=jwtServ.generateToken(userDetails);
		assertNotNull(token);			
	}
	@Test
	void testExtractLogin() {
		User user= new User();
		user.setId(1L);
		user.setLogin("mario");
		
		String token=jwtServ.generateTokenRegister(user);
		String login = jwtServ.extractLogin(token);
		assertEquals("mario",login);
	}
	@Test
	void testTokenValid() {
		User user= new User();
		user.setId(1L);
		user.setLogin("Mario");
		String token = jwtServ.generateTokenRegister(user);
		boolean valid=jwtServ.isTokenValid(token, "Mario");
		assertTrue(valid);
	}
	
	@Test
	void testTokenInvalidLogin() {
		User user= new User();
		user.setId(1L);
		user.setLogin("Bad");
		String token = jwtServ.generateTokenRegister(user);
		boolean valid=jwtServ.isTokenValid(token, "Mario");
		assertFalse(valid);
	}

}
