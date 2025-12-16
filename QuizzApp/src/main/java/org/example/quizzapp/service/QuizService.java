package org.example.quizzapp.service;

import lombok.RequiredArgsConstructor;
import org.example.quizzapp.Exception.*;
import org.example.quizzapp.dto.*;
import org.example.quizzapp.model.*;
import org.example.quizzapp.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ResponseRepository responseRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;

    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    public Quiz createQuiz(CreateQuizDTO dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        Quiz quizz = Quiz.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
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
                        .correctAnswers(q.getCorrectAnswers())
                        .question_type(q.getQuestion_type())
                        .quiz(finalQuizz)
                        .build())
                .toList();

        questionRepository.saveAll(questions);

        return finalQuizz;
    }

    public Quiz getQuizById(Long id, String userEmail) {
        Optional<Quiz> Quiz = quizRepository.findById(id);
        if (Quiz.isPresent()) {
            return Quiz.get();
        }

        User user = userRepository.findByEmail(userEmail)
                .orElse(null);

        if (user != null) {
            return quizRepository.findByIdAndCreatedBy(id, user)
                    .orElseThrow(() -> new QuizNotFoundOrAccessDenied(id));
        }

        throw new QuizNotFoundOrAccessDenied(id);
    }

    public List<QuizDTO> getMyQuizzes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        List<Quiz> quizzes = quizRepository.findByCreatedBy(user);

        return quizzes.stream().map(quiz -> {
            List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
                    .map(q -> new QuestionDTO(
                            q.getId(),
                            q.getText(),
                            q.getOptions(),
                            q.getQuestion_type(),
                            q.getCorrectAnswers()
                    ))
                    .toList();

            return new QuizDTO(
                    quiz.getId(),
                    quiz.getTitle(),
                    quiz.getDescription(),
                    quiz.isRequiresAuth(),
                    quiz.getCreatedBy().getEmail(),
                    quiz.getCreatedAt(),
                    quiz.getPassingScore(),
                    questionDTOs
            );
        }).toList();

    }

    @Transactional
    public Quiz updateQuiz(Long id, UpdateQuizDTO dto, String email) {
        Quiz quiz = quizRepository.findByIdAndCreatedBy(id, getUser(email))
                .orElseThrow(() -> new QuizNotFoundOrAccessDenied(id));

        //update quiz metadata
        if (dto.getTitle() != null) quiz.setTitle(dto.getTitle());
        if (dto.getDescription() != null) quiz.setDescription(dto.getDescription());
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
                            .correctAnswers(dtoQuestion.getCorrectAnswers())
                            .question_type(dtoQuestion.getQuestion_type())
                            .quiz(quiz)
                            .build();
                    questionRepository.save(newQuestion);
                }
            }
        }

        List<Question> toDelete = existingQuestions.stream()
                .filter(q -> !questionsToKeep.contains(q.getId()))
                .toList();

        if (!toDelete.isEmpty()) {
            questionRepository.deleteAll(toDelete);
        }

        return quiz;
    }

    private void updateQuestionFromDTO(Question question, QuestionDTO dto) {
        question.setText(dto.getText());
        question.setOptions(dto.getOptions());
        question.setCorrectAnswers(dto.getCorrectAnswers());
        question.setQuestion_type(dto.getQuestion_type());
    }

    public void deleteQuiz(Long id, String email) {
        Quiz quiz = quizRepository.findByIdAndCreatedBy(id, getUser(email))
                .orElseThrow(() -> new QuizNotFoundOrAccessDenied(id));
        quizRepository.delete(quiz);
    }

    @Transactional   //because we are saving many entites either save all or if fails retract everything
    public SubmissionResult submitQuiz(Long quizId,
                                       QuizSubmissionDTO submission,
                                       String authenticatedEmail) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException(quizId));

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
                throw new DisplayNameRequiredException();
            }
        }

        Response response = Response.builder()
                .quiz(quiz)
                .user(user)
                .displayName(displayName)
                .timeTakenSeconds(submission.getTimeTaken())
                .build();

        responseRepository.save(response);


        // Validate answers
        List<Answer> answers = submission.getAnswers().stream()
                .map(dto -> {

                    //get the question
                    Question question = questionRepository.findById(dto.getQuestionId())
                            .orElseThrow(() -> new QuizNotFoundException(quizId));

                    //get selected answers
                    List<String> selected = dto.getSelectedAnswers() != null ? dto.getSelectedAnswers() : new ArrayList<>();

                    //validate selected answers if they exist
                    for(String ans: selected){
                        if(!question.getOptions().contains(ans)){
                            throw new InvalidOptionsException(ans);
                        }
                    }

                    //compute correct answers
                    boolean correct = isCorrectAnswer(selected, question);

                    return Answer.builder()
                            .question(question)
                            .selectedAnswers(dto.getSelectedAnswers() != null ? dto.getSelectedAnswers() : new ArrayList<>())
                            .response(response)
                            .isCorrect(correct)
                            .build();
                })
                .toList();

        answerRepository.saveAll(answers);

        // Calculate score
        int correctAnswers = (int) answers.stream().filter(Answer::isCorrect).count();
        int totalQuestions = answers.size();
        int score = totalQuestions > 0 ? (correctAnswers * 100) / totalQuestions : 0;

        //persist response results to db
        response.setTotalQuestions(totalQuestions);
        response.setCorrectAnswers(correctAnswers);
        response.setScore(score);
        responseRepository.save(response);

        //Debugging
        log.info("Quiz {} submitted by {} - Score: {}/{}", quizId, displayName, correctAnswers, totalQuestions);

        return SubmissionResult.builder()
                .score(score)
                .correctAnswers(correctAnswers)
                .totalQuestions(totalQuestions)
                .passed(score >= quiz.getPassingScore())
                .build();
    }

    //helper method
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    public QuizAnalytics getQuizAnalytics(Long quizId, String ownerEmail) {
        // 1. Verify quiz exists and user is owner
        Quiz quiz = quizRepository.findByIdAndCreatedBy(quizId, getUser(ownerEmail))
                .orElseThrow(() -> new QuizNotFoundOrAccessDenied(quizId));

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

    @Transactional(readOnly=true)
    public ResponseDTO getResponseDetail(Long responseId, String ownerEmail) {
        // 1. Verify ownership
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResponseNotFoundException(responseId));

        Quiz quiz = response.getQuiz();

        if (quiz == null) {
            throw new InvalidOrExpiredLinkException();
        }

        if (!quiz.getCreatedBy().getEmail().equals(ownerEmail)) {
            throw new NotAuthorizedToGetResourceException();
        }

        // 2. Build DTO
        ResponseDTO dto = ResponseDTO.builder()
                .id(response.getId())
                .displayName(response.getDisplayName())
                .submittedAt(response.getSubmittedAt())
                .score(response.getScore())
                .build();

        List<AnswerDTO> answerDetails = response.getAnswers().stream()
                .map(answer -> {
                    Question question = answer.getQuestion();

                return AnswerDTO.builder()
                        .questionId(question.getId())
                        .questionText(question.getText())
                        .selectedAnswers(answer.getSelectedAnswers())
                        .correctAnswers(question.getCorrectAnswers())
                        .isCorrect(answer.isCorrect())
                        .build();



                })
                .toList();

        dto.setAnswers(answerDetails);
        return dto;
    }

    @Transactional(readOnly=true)
    public List<ResponseSummaryDTO> getResponses(Long quizId, String ownerEmail){
        // 1. Verify ownership
        Quiz quiz = quizRepository.findByIdAndCreatedBy(quizId, getUser(ownerEmail))
                .orElseThrow(() -> new QuizNotFoundOrAccessDenied(quizId));

        // 2. Fetch responses
        List<Response> responses = responseRepository.findByQuiz(quiz);

        return responses.stream().map(response -> ResponseSummaryDTO.builder()
                .id(response.getId())
                .displayName(response.getDisplayName())
                .score(response.getScore())
                .submittedAt(response.getSubmittedAt())
                .build()).toList();
    }

    //generate the token for sharing quiz links for guests to be able to pass the quiz
    public String createOrRefreshShareToken(Long quizId, String ownerEmail) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new QuizNotFoundException(quizId));

        //check if the ownner is the one creating the sharing link
        if(!quiz.getCreatedBy().getEmail().equals(ownerEmail)) {
            throw new NotAuthorizedToGetResourceException();
        }

        //32 characters 128-bit entropy (very secure)
        String newToken = UUID.randomUUID().toString().replace("-","");
        quiz.setShareToken(newToken);
        quizRepository.save(quiz);
        return newToken;
    }

    public void revokeShareToken(Long quizId, String ownerEmail){
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new QuizNotFoundException(quizId));

        //check if the ownner is the one revoking/deleting the sharing link
        if(!quiz.getCreatedBy().getEmail().equals(ownerEmail)) {
            throw new NotAuthorizedToGetResourceException();
        }

        quiz.setShareToken(null);
        quizRepository.save(quiz);
    }

    public Quiz getSharedQuiz(String shareToken){
        return quizRepository.findByShareToken(shareToken)
                .orElseThrow(InvalidOrExpiredLinkException::new);
    }


    //helper method for submitQuiz
    private boolean isCorrectAnswer(List<String> selected, Question question) {
        if (selected == null || selected.isEmpty() || question.getCorrectAnswers() == null) {
            return false;
        }

        Set<String> submitted = selected.stream()
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toSet());

        Set<String> correct = question.getCorrectAnswers().stream()
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toSet());

        return submitted.equals(correct);
    }


}
