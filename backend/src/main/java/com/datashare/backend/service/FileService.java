package com.datashare.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.repository.UserFileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {

    private final UserFileRepository fileRepository;

    private final Path storageLocation = Paths.get("uploads"); 

    public UserFile storeFile(MultipartFile file, User user, int expireDays) throws IOException {
    	long maxSize = 1024L * 1024L * 1024L; // 1 GB
    	   if (file.getSize() > maxSize) {
    	        throw new IllegalArgumentException("File trop grande. Max 1GB.");
    	    }
    	   String filename=file.getOriginalFilename();
    	   String lowerCaseName=filename.toLowerCase();
    	   String[] forbiddenExtensions = { ".exe", ".bat", ".cmd", ".sh" };
    	   		for(String ext : forbiddenExtensions) {
    	   			if(lowerCaseName.endsWith(ext)) {throw new IllegalArgumentException("Tipo di file non consentito: " + ext);
    	   			}
    	   		}
        if (!Files.exists(storageLocation)) {
            Files.createDirectories(storageLocation);
        }

        String savedName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path targetLocation = storageLocation.resolve(savedName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        String token = UUID.randomUUID().toString(); 
        UserFile userFile = new UserFile();
        userFile.setFileName(file.getOriginalFilename());
        userFile.setFilePath(targetLocation.toString());
        userFile.setFileSize(file.getSize());
         userFile.setDownloadToken(token);
        userFile.setExpiresAt(LocalDateTime.now().plusDays(expireDays));
        userFile.setUser(user);

        return fileRepository.save(userFile);
    }

    public List<UserFile> getUserFiles(User user) {
        return fileRepository.findAllByUserId(user.getId());
    }
    public UserFile getFileById(Long id) {
        return fileRepository.findById(id).orElse(null);
    }

    public void deleteFile(UserFile file) throws IOException {
        Files.deleteIfExists(Paths.get(file.getFilePath()));
        fileRepository.delete(file);
    }

    public void deleteExpiredFiles() throws IOException {
        List<UserFile> expiredFiles = fileRepository.findAllByExpiresAtBefore(LocalDateTime.now());
        for (UserFile file : expiredFiles) {
            deleteFile(file);
        }
    }
    public UserFile getFileByToken(String token) {
    	return fileRepository.findByDownloadToken(token).orElse(null);
    }
    
}