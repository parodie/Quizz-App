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
import java.util.Map;

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

    @GetMapping("/my/{quizId}")
    public ResponseEntity<Quiz> getQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        Quiz quiz = quizService.getQuizById(quizId, email);
        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable Long quizId,
            @RequestBody @Valid UpdateQuizDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Quiz quiz = quizService.updateQuiz(quizId, dto, email);
        return ResponseEntity.ok(quiz);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        String email = authentication.getName();
        quizService.deleteQuiz(quizId, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{quizId}/results")
    public ResponseEntity<QuizAnalytics> getQuizAnalytics(
            @PathVariable Long quizId,
            Authentication authentication) {

        String email = authentication.getName();
        QuizAnalytics analytics = quizService.getQuizAnalytics(quizId, email);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<SubmissionResult> submitQuizz(@PathVariable Long quizId,
                                                        @RequestBody @Valid QuizSubmissionDTO submission,
                                                        Authentication authentication){
        String userEmail = authentication != null ? authentication.getName() : null;

        SubmissionResult result = quizService.submitQuiz(quizId, submission, userEmail);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/responses/{responseId}")
    public ResponseEntity<ResponseDTO> getResponseDetail(
            @PathVariable Long responseId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ResponseDTO dto = quizService.getResponseDetail(responseId, userEmail);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{quizId}/responses")
    public ResponseEntity<List<ResponseSummaryDTO>> getResponses(@PathVariable Long quizId, Authentication authentication) {
        String email = authentication.getName();
        List<ResponseSummaryDTO> dto = quizService.getResponses(quizId, email);

        return ResponseEntity.ok(dto);
    }


    //apis for unlisted urls (shared links) for guests to be able to take the quizzes
    @GetMapping("/public/{shareToken}")
    public ResponseEntity<Quiz> getSharedQuiz(@PathVariable String shareToken) {
        Quiz quiz = quizService.getSharedQuiz(shareToken);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{quizId}/share")
    public ResponseEntity<Map<String, String>> createOrRefreshSharingToken(@PathVariable Long quizId, Authentication authentication){
        String email = authentication.getName();
        String token = quizService.createOrRefreshShareToken(quizId, email);
        return ResponseEntity.ok(Map.of("shareToken", token));
    }

    @DeleteMapping("/{quizId}/share")
    public ResponseEntity<Void> revokeSharingToken(@PathVariable Long quizId, Authentication authentication){
        String email = authentication.getName();
        quizService.revokeShareToken(quizId, email);
        return ResponseEntity.noContent().build();
    }

}


