package org.example.quizzapp.Exception;

public class NotAuthorizedToGetResourceException extends RuntimeException{

    public NotAuthorizedToGetResourceException() {
        super("Not authorized to get This Resource");
    }
}
