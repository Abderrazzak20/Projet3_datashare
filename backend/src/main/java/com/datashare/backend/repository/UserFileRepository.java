package com.datashare.backend.repository;



import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datashare.backend.entities.UserFile;

public interface UserFileRepository extends JpaRepository<UserFile, Long> {
    
    Optional<UserFile> findById(Long id);

    List<UserFile> findAllByUserId(Long userId);

    List<UserFile> findAllByExpiresAtBefore(LocalDateTime now);
    Optional<UserFile>findByDownloadToken(String token);
}