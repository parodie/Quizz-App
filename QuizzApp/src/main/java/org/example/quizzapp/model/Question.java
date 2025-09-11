package org.example.quizzapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.quizzapp.config.JsonConverter;
import org.example.quizzapp.model.enums.QuestionType;

import java.util.List;

@Entity
@Table(name = "questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Convert(converter = JsonConverter.class)
    private List<String> options;

    @Column(nullable = false)
    private String correctAnswer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType question_type;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;
}
