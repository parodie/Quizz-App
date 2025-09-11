package org.example.quizzapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizAnalytics {
    private String quizTitle;
    private long totalAttempts;
    private double averageScore; // out of 100
    private double passRate;     // % of users who passed
    private double averageTimeSeconds;
}
