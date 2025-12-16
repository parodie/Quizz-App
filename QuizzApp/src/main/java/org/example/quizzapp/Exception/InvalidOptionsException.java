package org.example.quizzapp.Exception;

public class InvalidOptionsException extends RuntimeException {
    public InvalidOptionsException(String message) {
        super("Invalid Options : " + message);
    }
}
