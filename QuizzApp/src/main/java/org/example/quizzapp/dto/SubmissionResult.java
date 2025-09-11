package org.example.quizzapp.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class SubmissionResult {
    private int score;
    private int correctAnswers;
    private int totalQuestions;
    private boolean passed;
}
