package com.datashare.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.datashare.backend.Handler.BadRequestException;
import com.datashare.backend.Handler.NotFoundException;
import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.repository.UserFileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

	private final UserFileRepository fileRepository;

	private final Path storageLocation = Paths.get("uploads");

	public UserFile storeFile(MultipartFile file, User user, int expireDays) throws IOException {

		log.info("Upload démarré par user: {} - fichier: {}", user.getEmail(), file.getOriginalFilename());

		long maxSize = 1024L * 1024L * 1024L;

		if (file.getSize() > maxSize) {
			log.warn("Upload refusé (taille > 1GB) pour user: {}", user.getEmail());
			throw new BadRequestException("File trop grande. Max 1GB.");
		}

		String filename = file.getOriginalFilename();

		if (filename == null || filename.isBlank()) {
			log.warn("Upload refusé - nom de fichier invalide pour user: {}", user.getEmail());
			throw new BadRequestException("Nom de fichier invalide");
		}

		String lowerCaseName = filename.toLowerCase();

		String[] forbiddenExtensions = { ".exe", ".bat", ".cmd", ".sh" };

		for (String ext : forbiddenExtensions) {
			if (lowerCaseName.endsWith(ext)) {
				log.warn("Upload refusé - extension interdite {} pour user: {}", ext, user.getEmail());
				throw new BadRequestException("Type de fichier non autorisé: " + ext);
			}
		}

		if (!Files.exists(storageLocation)) {
			Files.createDirectories(storageLocation);
		}

		String savedName = System.currentTimeMillis() + "_" + Paths.get(filename).getFileName();
		Path targetLocation = storageLocation.resolve(savedName);

		Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

		String token = UUID.randomUUID().toString();

		UserFile userFile = new UserFile();
		userFile.setFileName(filename);
		userFile.setFilePath(targetLocation.toString());
		userFile.setFileSize(file.getSize());
		userFile.setDownloadToken(token);
		userFile.setExpiresAt(LocalDateTime.now().plusDays(expireDays));
		userFile.setUser(user);

		UserFile saved = fileRepository.save(userFile);

		log.info("Upload réussi - fichier id: {} - token: {}", saved.getId(), token);

		return saved;
	}

	public List<UserFile> getUserFiles(User user) {
		return fileRepository.findAllByUserId(user.getId());
	}

	public UserFile getFileById(Long id) {
		return fileRepository.findById(id).orElseThrow(() -> new NotFoundException("Fichier introuvable"));
	}

	public void deleteFile(UserFile file) throws IOException {
		log.info("Suppression fichier id: {} par user: {}", file.getId(), file.getUser().getEmail());
		Files.deleteIfExists(Paths.get(file.getFilePath()));
		fileRepository.delete(file);
		log.info("Fichier supprimé avec succès id: {}", file.getId());
	}

	public void deleteExpiredFiles() throws IOException {
		List<UserFile> expiredFiles = fileRepository.findAllByExpiresAtBefore(LocalDateTime.now());
		for (UserFile file : expiredFiles) {
			deleteFile(file);
		}
	}

	public UserFile getFileByToken(String token) {
		log.info("Accès fichier via token");
		UserFile file = fileRepository.findByDownloadToken(token).orElseThrow(() -> {
			log.warn("Token invalide ou fichier introuvable");
			return new NotFoundException("Fichier introuvable");
		});

		if (file.getExpiresAt() != null && file.getExpiresAt().isBefore(LocalDateTime.now())) {
			log.warn("Accès refusé - fichier expiré id: {}", file.getId());
			throw new BadRequestException("Fichier expiré");
		}
		log.info("Fichier accédé via token id: {}", file.getId());
		return file;
	}

}