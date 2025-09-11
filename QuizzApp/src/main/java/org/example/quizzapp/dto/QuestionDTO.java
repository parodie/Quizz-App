package org.example.quizzapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.quizzapp.model.enums.QuestionType;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;

    @NotBlank(message = "Question text is required")
    private String text;

    @NotNull(message = "Options are required")
    @Size(min = 2, message = "At least two options required")
    private List<String> options;


    @NotNull(message = "Question type is required")
    private QuestionType question_type;

    @NotBlank(message = "Correct answers are required")
    private String correctAnswer;
}

