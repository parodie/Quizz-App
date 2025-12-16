package org.example.quizzapp.dto;

import jakarta.persistence.Convert;
import lombok.*;
import org.example.quizzapp.config.JsonConverter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDTO {
    private Long questionId;

    @Convert(converter = JsonConverter.class)
    private List<String> selectedAnswers;

    private String questionText;

    private List<String> correctAnswers;

    private boolean isCorrect;
}
