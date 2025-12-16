package org.example.quizzapp.Exception;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid credentials");
    }
}
