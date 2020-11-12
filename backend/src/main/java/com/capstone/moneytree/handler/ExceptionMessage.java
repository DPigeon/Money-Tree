package com.capstone.moneytree.handler;

public enum ExceptionMessage {
    ENTITY_NOT_FOUND("Requested entity not found"),
    ILLEGAL_ARGUMENT("Illegal argument in the URI"),
    REQUEST_NOT_FOUND("Request was not found"),
    NULL_POINTER("Arguments are null")
    ;

    private final String message;

    ExceptionMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
