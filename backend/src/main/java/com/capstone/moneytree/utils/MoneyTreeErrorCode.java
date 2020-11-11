package com.capstone.moneytree.utils;

public enum MoneyTreeErrorCode {

    INVALID_USER("This user is invalid"),
    MISSING_TOKEN("Token is missing");

    private String message;

    MoneyTreeErrorCode(String message) {
        this.message = message;
    }

    public String message() {
        return this.message;
    }
}