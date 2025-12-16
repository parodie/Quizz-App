package org.example.quizzapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateQuizDTO {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Integer passingScore;

    @Valid
    private List<QuestionDTO> questions;
}
