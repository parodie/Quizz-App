package org.example.quizzapp.dto;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.quizzapp.config.JsonConverter;
import org.example.quizzapp.model.enums.QuestionType;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;

    @NotBlank(message = "Question text is required")
    private String text;

    @NotNull(message = "Options are required")
    @Size(min = 2, message = "At least two options required")
    private List<String> options;


    @NotNull(message = "Question type is required")
    private QuestionType question_type;

    @NotEmpty(message = "Correct answers are required")
    @Convert(converter = JsonConverter.class)
    private List<String> correctAnswers;
}

