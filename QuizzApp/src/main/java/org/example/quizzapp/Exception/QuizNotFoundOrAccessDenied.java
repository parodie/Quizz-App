package org.example.quizzapp.Exception;

public class QuizNotFoundOrAccessDenied extends RuntimeException{
    public QuizNotFoundOrAccessDenied(Long quizId) {
        super("Quiz with ID " + quizId + " not found or Access Denied to Access the Quiz");
    }
}
