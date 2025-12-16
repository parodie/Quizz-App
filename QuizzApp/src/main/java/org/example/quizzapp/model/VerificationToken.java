package org.example.quizzapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    private LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
