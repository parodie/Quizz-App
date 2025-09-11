package org.example.quizzapp.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private boolean isPublic;
    private boolean requiresAuth;
    private String createdByEmail;
    private LocalDateTime createdAt;
    private int passingScore;
    private List<QuestionDTO> questions;
}
