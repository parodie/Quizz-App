package org.example.quizzapp.service;

import lombok.RequiredArgsConstructor;
import org.example.quizzapp.dto.*;
import org.example.quizzapp.model.*;
import org.example.quizzapp.repositories.QuestionRepository;
import org.example.quizzapp.repositories.QuizRepository;
import org.example.quizzapp.repositories.ResponseRepository;
import org.example.quizzapp.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ResponseRepository responseRepository;
    private final UserRepository userRepository;

    public Quiz createQuiz(CreateQuizDTO dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quizz = Quiz.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .isPublic(dto.isPublic())
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .passingScore(dto.getPassingScore() != null ? dto.getPassingScore() : 60)
                .build();

        quizz = quizRepository.save(quizz);

        Quiz finalQuizz = quizz;

        List<Question> questions = dto.getQuestions().stream()
                .map(q -> Question.builder()
                        .text(q.getText())
                        .options(q.getOptions())
                        .correctAnswer(q.getCorrectAnswer())
                        .question_type(q.getQuestion_type())
                        .quiz(finalQuizz)
                        .build())
                .collect(Collectors.toList());

        questionRepository.saveAll(questions);

        return finalQuizz;
    }

    public Quiz getQuizById(Long id, String userEmail) {
        Optional<Quiz> publicQuiz = quizRepository.findPublicQuizById(id);
        if (publicQuiz.isPresent()) {
            return publicQuiz.get();
        }

        User user = userRepository.findByEmail(userEmail)
                .orElse(null);

        if (user != null) {
            return quizRepository.findByIdAndCreatedBy(id, user)
                    .orElseThrow(() -> new RuntimeException("Quiz not found or access denied"));
        }

        throw new RuntimeException("Quiz not found or access denied");
    }

    public List<QuizDTO> getMyQuizzes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Quiz> quizzes = quizRepository.findByCreatedBy(user);

        if (quizzes.isEmpty()) {
            throw new RuntimeException("No quizzes found for this user");
        }

        return quizzes.stream().map(quiz -> {
            List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
                    .map(q -> new QuestionDTO(
                            q.getId(),
                            q.getText(),
                            q.getOptions(),
                            q.getQuestion_type(),
                            q.getCorrectAnswer()
                    ))
                    .collect(Collectors.toList());

            return new QuizDTO(
                    quiz.getId(),
                    quiz.getTitle(),
                    quiz.getDescription(),
                    quiz.isPublic(),
                    quiz.isRequiresAuth(),
                    quiz.getCreatedBy().getEmail(),
                    quiz.getCreatedAt(),
                    quiz.getPassingScore(),
                    questionDTOs
            );
        }).collect(Collectors.toList());

    }

    @Transactional
    public Quiz updateQuiz(Long id, UpdateQuizDTO dto, String email) {
        Quiz quiz = quizRepository.findByIdAndCreatedBy(id, getUser(email))
                .orElseThrow(() -> new RuntimeException("Quiz not found or not authorized"));

        //update quiz metadata
        if (dto.getTitle() != null) quiz.setTitle(dto.getTitle());
        if (dto.getDescription() != null) quiz.setDescription(dto.getDescription());
        quiz.setPublic(dto.isPublic());
        if (dto.getPassingScore() != null) quiz.setPassingScore(dto.getPassingScore());

        quiz = quizRepository.save(quiz);

        // Get existing questions
        List<Question> existingQuestions = questionRepository.findByQuiz(quiz);
        Map<Long, Question> existingQuestionMap = existingQuestions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Track which questions to keep
        Set<Long> questionsToKeep = new HashSet<>();

        // Process incoming questions
        if (dto.getQuestions() != null) {
            for (QuestionDTO dtoQuestion : dto.getQuestions()) {
                if (dtoQuestion.getId() != null) {
                    //Update existing question
                    Question existing = existingQuestionMap.get(dtoQuestion.getId());
                    if (existing != null && existing.getQuiz().getId().equals(quiz.getId())) {
                        updateQuestionFromDTO(existing, dtoQuestion);
                        questionRepository.save(existing);
                        questionsToKeep.add(existing.getId());
                    }
                } else {
                    //Create new question
                    Question newQuestion = Question.builder()
                            .text(dtoQuestion.getText())
                            .options(dtoQuestion.getOptions())
                            .correctAnswer(dtoQuestion.getCorrectAnswer())
                            .question_type(dtoQuestion.getQuestion_type())
                            .quiz(quiz)
                            .build();
                    questionRepository.save(newQuestion);
                }
            }
        }

        List<Question> toDelete = existingQuestions.stream()
                .filter(q -> !questionsToKeep.contains(q.getId()))
                .collect(Collectors.toList());

        if (!toDelete.isEmpty()) {
            questionRepository.deleteAll(toDelete);
        }

        return quiz;
    }

    private void updateQuestionFromDTO(Question question, QuestionDTO dto) {
        question.setText(dto.getText());
        question.setOptions(dto.getOptions());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setQuestion_type(dto.getQuestion_type());
    }

    public void deleteQuiz(Long id, String email) {
        Quiz quiz = quizRepository.findByIdAndCreatedBy(id, getUser(email))
                .orElseThrow(() -> new RuntimeException("Quiz not found or not authorized"));
        quizRepository.delete(quiz);
    }

    public SubmissionResult submitQuiz(Long quizId,
                                       QuizSubmissionDTO submission,
                                       String authenticatedEmail) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Get user if logged in
        User user = null;
        String displayName = submission.getDisplayName();

        if (authenticatedEmail != null) {
            user = userRepository.findByEmail(authenticatedEmail)
                    .orElse(null);
            // Optional: use real name or email if displayName not provided
            if (displayName == null || displayName.trim().isEmpty()) {
                displayName = user != null && user.getName() != null ?
                        user.getName() : authenticatedEmail.split("@")[0];
            }
        } else {
            // Guest must provide display name
            if (displayName == null || displayName.trim().isEmpty()) {
                throw new RuntimeException("Display name is required for guests");
            }
        }

        // Validate answers
        List<Answer> answers = submission.getAnswers().stream()
                .map(dto -> {
                    Question question = questionRepository.findById(dto.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found"));




                    return Answer.builder()
                            .question(question)
                            .selectedAnswer(dto.getSelectedAnswer())
                            .build();
                })
                .collect(Collectors.toList());

        // Calculate score
        int correctAnswers = 0;
        for (Answer answer : answers) {
            if (answer.isCorrect()) {
                correctAnswers++;
            }
        }

        int totalQuestions = answers.size();
        int score = totalQuestions > 0 ? (correctAnswers * 100) / totalQuestions : 0;

        // Save response
        Response response = Response.builder()
                .quiz(quiz)
                .user(user)
                .displayName(displayName)
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .score(score)
                .timeTakenSeconds(submission.getTimeTaken()) // if sent from frontend
                .build();

        responseRepository.save(response);

        return SubmissionResult.builder()
                .score(score)
                .correctAnswers(correctAnswers)
                .totalQuestions(totalQuestions)
                .passed(score >= quiz.getPassingScore()) // assume Quiz has passingScore field
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public QuizAnalytics getQuizAnalytics(Long quizId, String ownerEmail) {
        // 1. Verify quiz exists and user is owner
        Quiz quiz = quizRepository.findByIdAndCreatedBy(quizId, getUser(ownerEmail))
                .orElseThrow(() -> new RuntimeException("Quiz not found or access denied"));

        // 2. Get all responses for this quiz
        List<Response> responses = responseRepository.findByQuiz(quiz);

        // 3. If no responses, return zeros
        if (responses.isEmpty()) {
            return QuizAnalytics.builder()
                    .quizTitle("")
                    .totalAttempts(0)
                    .averageScore(0)
                    .passRate(0)
                    .averageTimeSeconds(0)
                    .build();
        }

        // 4. Calculate stats
        long total = responses.size();
        double avgScore = responses.stream()
                .mapToInt(Response::getScore)
                .average()
                .orElse(0);

        long passed = responses.stream()
                .filter(r -> r.getScore() >= quiz.getPassingScore())
                .count();

        double passRate = (passed * 100.0) / total;

        double avgTime = responses.stream()
                .mapToDouble(Response::getTimeTakenSeconds)
                .average()
                .orElse(0);

        // 5. Return formatted result
        return QuizAnalytics.builder()
                .quizTitle(quiz.getTitle())
                .totalAttempts(total)
                .averageScore(Math.round(avgScore * 100.0) / 100.0)  // 2 decimal places
                .passRate(Math.round(passRate * 100.0) / 100.0)
                .averageTimeSeconds(Math.round(avgTime))
                .build();
    }


}
