package org.example.quizzapp.repositories;

import org.example.quizzapp.model.Quiz;
import org.example.quizzapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByIdAndCreatedBy(Long id, User user);

    @Query("SELECT q FROM Quiz q WHERE q.isPublic = true")
    List<Quiz> findPublicQuizzes();

    List<Quiz> findByCreatedBy(User user);

    @Query("SELECT q FROM Quiz q WHERE q.id = :id AND q.isPublic = true")
    Optional<Quiz> findPublicQuizById(@Param("id") Long id);
}
