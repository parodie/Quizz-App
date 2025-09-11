package org.example.quizzapp.service;

import lombok.RequiredArgsConstructor;
import org.example.quizzapp.config.JwtUtil;
import org.example.quizzapp.dto.LoginResponse;
import org.example.quizzapp.model.User;
import org.example.quizzapp.model.VerificationToken;
import org.example.quizzapp.repositories.UserRepository;
import org.example.quizzapp.repositories.VerificationTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Register user + send verification email
    public void register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Generate token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(savedUser)
                .build();

        tokenRepository.save(verificationToken);

        // Send email
        emailService.sendVerificationEmail(email, token);
    }

    // Login: only if verified
    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(email);
        return LoginResponse.builder()
                .token(token)
                .email(email)
                .userId(user.getId())
                .build();
    }
}

