package com.capstone.moneytree.exception;

public class FailedUploadImageS3Exception extends RuntimeException {
    public FailedUploadImageS3Exception(String message) {
        super(message);
    }
}