package com.capstone.moneytree.handler.exception;

/**
 * A unique exception that is thrown when the user already exists in our database.
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
