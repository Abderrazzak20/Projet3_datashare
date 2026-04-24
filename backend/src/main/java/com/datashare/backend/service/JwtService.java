package com.datashare.backend.service;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.datashare.backend.entities.User;
import com.datashare.backend.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${JWT_SECRET_KEY}")
    private String SECRET_KEY;

    private final long EXPIRATION = 1000 * 60 * 60; 
    private final UserRepository userRepository;

    public JwtService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("utilisateur non trouve"));

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("id", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateTokenRegister(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractLogin(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, String login) {
        return extractLogin(token).equals(login) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}