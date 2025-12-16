package org.example.quizzapp.Exception;

public class QuestionNotFoundException extends RuntimeException{
    public QuestionNotFoundException(String message) {
        super(message);
    }
}
