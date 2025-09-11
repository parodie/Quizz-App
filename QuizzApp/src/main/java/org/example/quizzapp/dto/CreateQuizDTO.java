package org.example.quizzapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Builder
@Getter
@Setter
public class CreateQuizDTO {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Public/private is required")
    private boolean isPublic;

    private Integer passingScore;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<QuestionDTO> questions;
}
