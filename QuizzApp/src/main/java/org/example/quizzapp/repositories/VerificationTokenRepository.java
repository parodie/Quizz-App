package org.example.quizzapp.repositories;

import org.example.quizzapp.model.User;
import org.example.quizzapp.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    void deleteByUser(User user);
}
