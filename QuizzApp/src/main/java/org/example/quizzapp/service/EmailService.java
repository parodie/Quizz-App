package org.example.quizzapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("naitdayaaaicha2003@gmail.com");  // sender
        message.setTo(toEmail);
        message.setSubject("Verify Your Email - QuizApp");

        String verificationLink = "http://localhost:8080/api/auth/verify-email?token=" + token;
        String body = String.format("""
            Hello,

            Thank you for registering with QuizApp!
            Please verify your email by clicking the link below:

            %s

            This link will expire in 24 hours.

            If you didn't sign up, please ignore this email.

            Best,
            The QuizApp Team
            """, verificationLink);

        message.setText(body);
        mailSender.send(message);
    }
}
