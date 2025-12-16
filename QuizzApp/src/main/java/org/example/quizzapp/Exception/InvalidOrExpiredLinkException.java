package org.example.quizzapp.Exception;


public class InvalidOrExpiredLinkException extends RuntimeException{
    public InvalidOrExpiredLinkException() {
        super("Invalid or expired link!");
    }
}
