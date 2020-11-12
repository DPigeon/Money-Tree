package com.capstone.moneytree.handler;

public enum ExceptionMessage {
    ENTITY_NOT_FOUND("Requested entity not found"),
    ILLEGAL_ARGUMENT("Illegal argument(s) in the URI"),
    REQUEST_NOT_FOUND("Request was not found"),
    NULL_POINTER("Arguments are null"),
    USER_ALREADY_EXISTS("Email or username already exists!"),
    ;

    private final String message;

    ExceptionMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
