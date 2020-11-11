package com.capstone.moneytree.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoneyTreeError {

    private MoneyTreeErrorCode errorCode;
    private String message;

    public MoneyTreeError(MoneyTreeErrorCode errorCode){
        this.errorCode = errorCode;
    }

    public MoneyTreeErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(MoneyTreeErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}