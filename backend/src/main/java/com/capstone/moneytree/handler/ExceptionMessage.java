package com.capstone.moneytree.handler;

public enum ExceptionMessage {
    ENTITY_NOT_FOUND("Requested entity not found"),
    ILLEGAL_ARGUMENT("Illegal argument(s) in the URI"),
    REQUEST_NOT_FOUND("Request was not found"),
    NULL_POINTER("Arguments are null"),
    USER_ALREADY_EXISTS("Email or username already exists!"),
    MISSING_FIELDS("The entity is missing fields!"),
    FAILED_TO_UPLOAD_S3("Failed to upload image to S3"),
    BAD_REQUEST_MESSAGE("Bad request!"),
    CREDENTIALS_NOT_FOUND("Credentials not found");

    private final String message;

    ExceptionMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
