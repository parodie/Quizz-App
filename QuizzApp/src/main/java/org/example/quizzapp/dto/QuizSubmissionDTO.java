package org.example.quizzapp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionDTO {
    private List<AnswerDTO> answers;
    private String displayName;
    private double TimeTaken;
}
