package com.datashare.backend.E2E;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import com.datashare.backend.DTO.SignupRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TestFileE2E {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper mapper;

	@Test
	void fullDownloadClien() throws Exception {
		String loginRequest = """
				{
				"email":"mario@gmail.com",
				"password":"password123"
				}
				""";
		SignupRequest signup = new SignupRequest();
		signup.setEmail("mario@gmail.com");
		signup.setPassword("password123");
		mockMvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(signup))).andExpect(status().isOk());

		String LoginResponse = mockMvc
				.perform(post("/api/login").contentType(MediaType.APPLICATION_JSON).content(loginRequest))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
		String token = mapper.readTree(LoginResponse).get("token").asText();

		MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "informationnnnn".getBytes());
		String UploadResponse = mockMvc
				.perform(multipart("/api/files/upload").file(file).param("expireDays", "3").header("Authorization",
						"Bearer " + token))
				.andExpect(status().isOk()).andExpect(jsonPath("$.downloadToken").exists()).andReturn().getResponse()
				.getContentAsString();

		String donloadToken = mapper.readTree(UploadResponse).get("downloadToken").asText();

		mockMvc.perform(get("/api/files/download/" + donloadToken)).andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("test.txt")))
				.andExpect(content().string("informationnnnn"));
	}

	@Test
	void testLoginFail() throws Exception {
		SignupRequest signup = new SignupRequest();
		signup.setEmail("Test@gmail.com");
		signup.setPassword("password123");
		mockMvc.perform(post("/api/register").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(signup))).andExpect(status().isOk());

		String badRequest = """
			    {
			        "email": "badLogin@gmail.com",
			        "password": "badPassword"
			    }
			    """;
		mockMvc.perform(post("/api/login").contentType(MediaType.APPLICATION_JSON).content(badRequest))
				.andExpect(status().isUnauthorized());
	}
	@Test
	void testDonwloadTokenInvalid()throws Exception {
		String invalidToken="Token-incorrect";
		mockMvc.perform(get("/api/files/download/"+invalidToken))
		.andExpect(status().isNotFound());
	}
	
	
}
