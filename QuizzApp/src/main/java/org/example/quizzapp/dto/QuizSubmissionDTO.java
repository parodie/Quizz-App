package org.example.quizzapp.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter @Setter
public class QuizSubmissionDTO {
    private List<AnswerDTO> answers;
    private String displayName;
    private double TimeTaken;
}
