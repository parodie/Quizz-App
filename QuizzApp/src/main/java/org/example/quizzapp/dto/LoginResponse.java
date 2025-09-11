package org.example.quizzapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String email;
    private Long userId;
}
