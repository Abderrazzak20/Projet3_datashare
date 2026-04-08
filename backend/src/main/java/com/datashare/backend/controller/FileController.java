package com.datashare.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.datashare.backend.DTO.FileUploadResponse;
import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

	private final FileService fileService;

	// --- Upload file ---
	@PostMapping("/upload")
	public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam(value = "expireDays", defaultValue = "7") int expireDays, @AuthenticationPrincipal User user)
			throws IOException {
		if (expireDays < 1 || expireDays > 7) {
			return ResponseEntity.badRequest().build();
		}
		try {
			UserFile savedFile = fileService.storeFile(file, user, expireDays);
			FileUploadResponse response = new FileUploadResponse(savedFile.getFileName(),
					 savedFile.getDownloadToken(),
					savedFile.getExpiresAt());
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new FileUploadResponse("", "", null));
		}
	}
	// --- Download file via ID ---
	@GetMapping("/download/{token}")
	public ResponseEntity<byte[]> downloadFile(@PathVariable String token) throws IOException {

		UserFile userFile = fileService.getFileByToken(token);
		if (userFile == null
				|| (userFile.getExpiresAt() != null && userFile.getExpiresAt().isBefore(LocalDateTime.now()))) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		Path path = Path.of(userFile.getFilePath());
		byte[] data = Files.readAllBytes(path);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + userFile.getFileName() + "\"")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(data);
	}

	// --- List user's files ---
	@GetMapping("/my-files")
	public ResponseEntity<List<UserFile>> getUserFiles(@AuthenticationPrincipal User user) {
		List<UserFile> files = fileService.getUserFiles(user);
		return ResponseEntity.ok(files);
	}

	// --- Delete file ---
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteFile(@PathVariable Long id, @AuthenticationPrincipal User user)
			throws IOException {
		UserFile file = fileService.getFileById(id);

		if (file == null || file.getUser() == null || !file.getUser().getId().equals(user.getId())) {
			return ResponseEntity.notFound().build();
		}

		fileService.deleteFile(file);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/info/{token}")
	public ResponseEntity<UserFile> getFileInfo(@PathVariable String token) {
	    return ResponseEntity.ok(fileService.getFileByToken(token));
	}
}