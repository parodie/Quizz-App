package org.example.quizzapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.quizzapp.config.JsonConverter;
import java.util.List;


@Entity
@Table(name = "answers")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "response_id", nullable = false)
    private Response response;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Convert(converter = JsonConverter.class)
    @Column(name = "selected_answers")
    private List<String> selectedAnswers;


    private boolean isCorrect;


}