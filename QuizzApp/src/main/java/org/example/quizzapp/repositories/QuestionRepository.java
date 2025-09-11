package org.example.quizzapp.repositories;

import org.example.quizzapp.model.Question;
import org.example.quizzapp.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuiz(Quiz quiz);
}
