package org.example.quizzapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.quizzapp.model.User;
import org.example.quizzapp.model.VerificationToken;
import org.example.quizzapp.repositories.UserRepository;
import org.example.quizzapp.repositories.VerificationTokenRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            return ResponseEntity.badRequest().body("Token expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken); // One-time use

        return ResponseEntity.ok("✅ Email verified! You can now log in.");
    }
}
