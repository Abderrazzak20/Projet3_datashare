package com.datashare.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import com.datashare.backend.Handler.BadRequestException;
import com.datashare.backend.Handler.NotFoundException;
import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.repository.UserFileRepository;

public class FileServiceTest {
	@Mock
	private UserFileRepository fileRepository;
	@InjectMocks
	private FileService fileService;
	private User user;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		user = new User();
		user.setId(1L);
	}

	@Test
	void testStoreFileSuccess() throws IOException {
		MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plan", "hello".getBytes());
		when(fileRepository.save(any(UserFile.class))).thenAnswer(invocation -> invocation.getArgument(0));
		UserFile saved = fileService.storeFile(file, user, 3);
		assertNotNull(saved.getDownloadToken());
		assertEquals("test.txt", saved.getFileName());
		assertEquals(user, saved.getUser());
		assertTrue(saved.getExpiresAt().isAfter(LocalDateTime.now()));
		verify(fileRepository, times(1)).save(any(UserFile.class));

	}

	@Test
	void TestfileStoreToLarge() {
		MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plan", new byte[0]) {
			@Override
			public long getSize() {
				return 1024L * 1024L * 1024L + 1;
			}
		};
		Exception ex = assertThrows(BadRequestException.class, () -> fileService.storeFile(file, user, 3));
		assertEquals("File trop grande. Max 1GB.", ex.getMessage());

	}

	@Test
	void TestForbiddenExtension() {
		MockMultipartFile file = new MockMultipartFile("file", "test.exe", "text/plan", "bad".getBytes());
		Exception ex = assertThrows(BadRequestException.class, () -> fileService.storeFile(file, user, 3));
		assertTrue(ex.getMessage().contains(".exe"));

	};

	@Test
	void TestgetUserFile() {
		List<UserFile> files = List.of(new UserFile(), new UserFile());
		when(fileRepository.findAllByUserId(1L)).thenReturn(files);
		List<UserFile> result = fileService.getUserFiles(user);
		assertEquals(2, result.size());
	}

	@Test
	void TestgetByToken() {
		UserFile file = new UserFile();
		when(fileRepository.findByDownloadToken("token123")).thenReturn(Optional.of(file));
		UserFile result = fileService.getFileByToken("token123");
		assertNotNull(result);
	}

	
	@Test
	void TestTokenNotFound() {
	    when(fileRepository.findByDownloadToken("bad"))
	            .thenReturn(Optional.empty());

	    Exception ex = assertThrows(NotFoundException.class,
	            () -> fileService.getFileByToken("bad"));

	    assertEquals("Fichier introuvable", ex.getMessage());
	}

	@Test
	void TestDeleteFile() throws IOException {
	    User user = new User();
	    user.setEmail("test@gmail.com");
	    UserFile file = new UserFile();
	    file.setUser(user); 
	    Path pathFile = Files.createTempFile("test", ".txt");
	    file.setFilePath(pathFile.toString());
	    fileService.deleteFile(file);
	    assertFalse(Files.exists(pathFile));
	    verify(fileRepository).delete(file);
	}
	
	@Test 
	void testDeleteExpiredFiles() throws IOException {
	    User user = new User();
	    user.setEmail("test@gmail.com");
	    UserFile file = new UserFile();
	    file.setUser(user); 
	    Path pathFile = Files.createTempFile("expired", ".txt");
	    file.setFilePath(pathFile.toString());
	    file.setExpiresAt(LocalDateTime.now().minusDays(1));
	    when(fileRepository.findAllByExpiresAtBefore(any()))
	            .thenReturn(List.of(file));
	    fileService.deleteExpiredFiles();
	    assertFalse(Files.exists(pathFile));
	    verify(fileRepository).delete(file);
	}
}
