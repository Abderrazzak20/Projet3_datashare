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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "File controller", description = "Gestion des fichiers : upload, download, suppression, consultation")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

	private final FileService fileService;

	@Operation(summary = "Uploader un fichier", description = "Permet d'uploader un fichier et de générer un lien de téléchargement unique")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Fichier uploadé avec succès"),
		@ApiResponse(responseCode = "400", description = "Fichier invalide ou trop volumineux"),
			@ApiResponse(responseCode = "401", description = "Non authentifié") })
	@PostMapping("/upload")
	public ResponseEntity<FileUploadResponse> uploadFile(
	        @RequestParam("file") MultipartFile file,
	        @RequestParam(value = "expireDays", defaultValue = "7") int expireDays,
	        @AuthenticationPrincipal User user) throws IOException {

	    if (expireDays < 1 || expireDays > 7) {
	        throw new IllegalArgumentException("Durée d'expiration invalide");
	    }

	    UserFile savedFile = fileService.storeFile(file, user, expireDays);

	    FileUploadResponse response = new FileUploadResponse(
	            savedFile.getFileName(),
	            savedFile.getDownloadToken(),
	            savedFile.getExpiresAt()
	    );

	    return ResponseEntity.ok(response);
	}

	@Operation(summary = "Télécharger un fichier via token", description = "Permet de télécharger un fichier avec un lien public (token)")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Téléchargement réussi"),
			@ApiResponse(responseCode = "404", description = "Token invalide ou fichier expiré") })
	@GetMapping("/download/{token}")
	public ResponseEntity<byte[]> downloadFile(@PathVariable String token) throws IOException {

		UserFile userFile = fileService.getFileByToken(token);
			Path path = Path.of(userFile.getFilePath());
		byte[] data = Files.readAllBytes(path);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + userFile.getFileName() + "\"")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(data);
	}

	@Operation( summary = "Lister les fichiers de l’utilisateur", description = "Retourne tous les fichiers uploadés par l'utilisateur connecté")	
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Informations récupérées"),
		@ApiResponse(responseCode = "404", description = "Fichier introuvable") })
	@GetMapping("/my-files")
	public ResponseEntity<List<UserFile>> getUserFiles(@AuthenticationPrincipal User user) {
		List<UserFile> files = fileService.getUserFiles(user);
		return ResponseEntity.ok(files);
	}

	@Operation(summary = "Supprimer un fichier", description = "Supprime un fichier de manière définitive (fichier + métadonnées)")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Fichier supprimé"),
		@ApiResponse(responseCode = "403", description = "Non autorisé"),
		@ApiResponse(responseCode = "404", description = "Fichier introuvable") })
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteFile(@PathVariable Long id, @AuthenticationPrincipal User user)
	        throws IOException {

	    UserFile file = fileService.getFileById(id);

	    if (file.getUser() == null || !file.getUser().getId().equals(user.getId())) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    }

	    fileService.deleteFile(file);
	    return ResponseEntity.noContent().build();
	}
	@Operation(summary = "Informations d’un fichier via token", description = "Retourne les informations d’un fichier partagé via token"
			)
			@ApiResponses({
			  @ApiResponse(responseCode = "200", description = "Fichier trouvé"),
			  @ApiResponse(responseCode = "404", description = "Fichier introuvable")
			})
	@GetMapping("/info/{token}")
	public ResponseEntity<UserFile> getFileInfo(@PathVariable String token) {
		return ResponseEntity.ok(fileService.getFileByToken(token));
	}
}