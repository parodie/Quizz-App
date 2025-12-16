package org.example.quizzapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuizDTO {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Integer passingScore;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<QuestionDTO> questions;
}
