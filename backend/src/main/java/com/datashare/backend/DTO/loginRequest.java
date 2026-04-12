package com.datashare.backend.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class loginRequest {
    @Schema(example = "user@gmail.com", description = "Email de l'utilisateur")
	@NotBlank
	@Email(message = "email invalide")
private String email;
    @Schema(example = "password123", description = "Mot de passe (min 8 caractères)")
	@NotBlank
	@Size(min = 8,message = "mot de passe minimum 8 character")
	private String password;
}
