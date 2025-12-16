package org.example.quizzapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {
    private int score;
    private int correctAnswers;
    private int totalQuestions;
    private boolean passed;
}
