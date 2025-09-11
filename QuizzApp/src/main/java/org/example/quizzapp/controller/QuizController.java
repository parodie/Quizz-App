package org.example.quizzapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.quizzapp.dto.*;
import org.example.quizzapp.model.Quiz;
import org.example.quizzapp.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(
            @RequestBody @Valid CreateQuizDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Quiz quiz = quizService.createQuiz(dto, email);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuizDTO>> getMyQuizzes(Authentication authentication) {
        String email = authentication.getName();
        List<QuizDTO> quizzesDto = quizService.getMyQuizzes(email);
        return ResponseEntity.ok(quizzesDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        Quiz quiz = quizService.getQuizById(id, email);
        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable Long id,
            @RequestBody @Valid UpdateQuizDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Quiz quiz = quizService.updateQuiz(id, dto, email);
        return ResponseEntity.ok(quiz);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        quizService.deleteQuiz(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<QuizAnalytics> getQuizAnalytics(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        QuizAnalytics analytics = quizService.getQuizAnalytics(id, email);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmissionResult> submitQuizz(@PathVariable Long id,
                                                        @RequestBody @Valid QuizSubmissionDTO submission,
                                                        Authentication authentication){
        String userEmail = authentication != null ? authentication.getName() : null;

        SubmissionResult result = quizService.submitQuiz(id, submission, userEmail);

        return ResponseEntity.ok(result);
    }


}


