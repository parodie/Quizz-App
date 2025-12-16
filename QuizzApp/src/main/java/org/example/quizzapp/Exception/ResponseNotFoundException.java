package org.example.quizzapp.Exception;


public class ResponseNotFoundException extends RuntimeException{
    public ResponseNotFoundException(Long responseId) {
        super("Response with ID " + responseId + " not found");
    }
}
