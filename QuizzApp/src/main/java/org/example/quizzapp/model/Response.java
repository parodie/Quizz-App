package org.example.quizzapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // null if anonymous

    @Column(name = "display_name", nullable = false)
    private String displayName;

    private int score;
    private int totalQuestions;
    private int correctAnswers;

    @Column(name = "time_taken_seconds")
    private double timeTakenSeconds;

    @CreatedDate
    private LocalDateTime submittedAt;
}