package org.example.quizzapp.repositories;

import org.example.quizzapp.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
