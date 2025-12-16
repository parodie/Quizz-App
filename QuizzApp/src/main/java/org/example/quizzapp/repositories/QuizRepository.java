package org.example.quizzapp.repositories;

import org.example.quizzapp.model.Quiz;
import org.example.quizzapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByIdAndCreatedBy(Long id, User user);

    List<Quiz> findByCreatedBy(User user);

    Optional<Quiz> findByShareToken(String shareToken);
}
