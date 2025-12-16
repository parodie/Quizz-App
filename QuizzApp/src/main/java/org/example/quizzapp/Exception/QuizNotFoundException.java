package org.example.quizzapp.Exception;


public class QuizNotFoundException extends RuntimeException{

    public QuizNotFoundException(Long quizId) {
        super("Quiz with ID " + quizId + " not found");
    }
}
