package com.datashare.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import com.datashare.backend.Handler.NotFoundException;
import com.datashare.backend.entities.User;
import com.datashare.backend.entities.UserFile;
import com.datashare.backend.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(FileController.class)
public class fileControllerTest {
	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private FileService fileService;
	@Autowired
	private ObjectMapper mapper;

	@Test
	void testUploadFile() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "test.ext", "text/plain", "contenu".getBytes());
		UserFile saved = new UserFile();
		saved.setFileName("test.txt");
		saved.setDownloadToken("token123");
		saved.setExpiresAt(LocalDateTime.now().plusDays(1));
		when(fileService.storeFile(any(), any(), anyInt())).thenReturn(saved);
		mockMvc.perform(multipart("/api/files/upload").file(file).param("expireDays", "3")).andExpect(status().isOk())
				.andExpect(jsonPath("$.fileName").value("test.txt"))
				.andExpect(jsonPath("$.downloadToken").value("token123"));
	}

	@Test
	void testExpiredDayInvalid() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "test.ext", "text/plain", "contenu".getBytes());
		mockMvc.perform(multipart("/api/files/upload").file(file).param("expireDays", "10"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testDownloadNotFound() throws Exception {
		when(fileService.getFileByToken("incorrect")).thenThrow(new NotFoundException("Fichier introuvable"));
		mockMvc.perform(get("/api/files/download/incorrect")).andExpect(status().isNotFound());

	}

	@Test
	void testGetMyFile() throws Exception {
		UserFile file = new UserFile();
		file.setFileName("test.txt");
		when(fileService.getUserFiles(any(User.class))).thenReturn(List.of(file));
		mockMvc.perform(get("/api/files/my-files")).andExpect(status().isOk());
	}



	@Test
	void testGetFileInfo() throws Exception {
		UserFile file = new UserFile();
		file.setFileName("test.txt");
		when(fileService.getFileByToken("Token123")).thenReturn(file);
		mockMvc.perform(get("/api/files/info/Token123")).andExpect(status().isOk())
				.andExpect(jsonPath("$.fileName").value("test.txt"));
	}
}
