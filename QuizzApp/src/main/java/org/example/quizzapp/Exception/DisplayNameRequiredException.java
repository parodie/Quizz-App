package org.example.quizzapp.Exception;

public class DisplayNameRequiredException extends RuntimeException{
    public DisplayNameRequiredException(){
        super("Display name is required for guests");
    }
}
