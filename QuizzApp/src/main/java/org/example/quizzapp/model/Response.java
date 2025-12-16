package org.example.quizzapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "responses")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
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

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Answer> answers = new ArrayList<>();

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