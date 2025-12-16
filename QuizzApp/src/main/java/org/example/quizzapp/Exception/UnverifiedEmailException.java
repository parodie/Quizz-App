package org.example.quizzapp.Exception;

public class UnverifiedEmailException extends RuntimeException{
    public UnverifiedEmailException(){
        super("Unverified Email, please verify your email first!");
    }
}
