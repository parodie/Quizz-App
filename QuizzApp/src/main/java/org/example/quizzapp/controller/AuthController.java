package org.example.quizzapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.quizzapp.dto.LoginRequest;
import org.example.quizzapp.dto.LoginResponse;
import org.example.quizzapp.dto.RegisterRequest;
import org.example.quizzapp.model.User;
import org.example.quizzapp.model.VerificationToken;
import org.example.quizzapp.repositories.UserRepository;
import org.example.quizzapp.repositories.VerificationTokenRepository;
import org.example.quizzapp.service.EmailService;
import org.example.quizzapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final VerificationTokenRepository verificationTokenRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Please check your email to verify your account.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Email already verified");
        }

        // Delete old token
        verificationTokenRepository.deleteByUser(user);

        // Generate new token
        String newToken = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .token(newToken)
                .user(user)
                .build();
        verificationTokenRepository.save(vt);

        // Send email
        emailService.sendVerificationEmail(email, newToken);

        return ResponseEntity.ok("Verification email resent");
    }
}
