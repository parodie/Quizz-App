package org.example.quizzapp.repositories;

import org.example.quizzapp.model.Quiz;
import org.example.quizzapp.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findByQuiz(Quiz quiz);
}
