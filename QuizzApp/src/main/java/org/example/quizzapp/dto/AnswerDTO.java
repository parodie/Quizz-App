package org.example.quizzapp.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AnswerDTO {
    private Long questionId;
    private String selectedAnswer;
}
