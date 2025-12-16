package org.example.quizzapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.quizzapp.config.JsonConverter;
import org.example.quizzapp.model.enums.QuestionType;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "questions")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Convert(converter = JsonConverter.class)
    private List<String> options;

    @Convert(converter = JsonConverter.class)
    private List<String> correctAnswers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType question_type;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;

    public List<String> getCorrectAnswers() {
        return correctAnswers != null ? correctAnswers : Collections.emptyList();
    }
}
