package com.datashare.backend.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FileUploadResponse {
	  private String fileName;
	    private String downloadToken;
	    private LocalDateTime expiresAt;
	   
}
