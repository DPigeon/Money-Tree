package com.capstone.moneytree.utils

import com.capstone.moneytree.exception.AlpacaException
import org.junit.Test
import org.springframework.http.HttpStatus
import spock.lang.Specification

class MoneyTreeErrorTest extends Specification {

    @Test
    def "It should create a MoneyTreeError"() {
        when: "the error is initialized"
        MoneyTreeError moneyTreeError = new MoneyTreeError()

        then: "It should be created"
        assert moneyTreeError != null
        assert moneyTreeError.getTimestamp() != null
    }

    @Test
    def "It should create a MoneyTreeError with a status"() {
        when: "the error is initialized with status"
        HttpStatus status = HttpStatus.BAD_REQUEST
        MoneyTreeError moneyTreeError = new MoneyTreeError(status)

        then: "Should be created"
        assert moneyTreeError != null
        assert moneyTreeError.getTimestamp() != null
        assert moneyTreeError.getStatus() == status
    }

    @Test
    def "It should create a MoneyTreeError with status and exception"() {
        when: "the error is initialized with status and exception"
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR
        Throwable throwable = new AlpacaException("error")
        MoneyTreeError moneyTreeError = new MoneyTreeError(status, throwable)

        then: "Should be created"
        assert moneyTreeError != null
        assert moneyTreeError.getTimestamp() != null
        assert moneyTreeError.getStatus() == status
        assert moneyTreeError.getDebugMessage() == throwable.getLocalizedMessage()
    }

    @Test
    def "It should create a MoneyTreeError with status, message and exception"() {
        when: "the error is initialized with status, message and exception"
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR
        String message = "Error authenticating with Alpaca"
        Throwable throwable = new AlpacaException("error")
        MoneyTreeError moneyTreeError = new MoneyTreeError(status, message, throwable)

        then: "Should be created"
        assert moneyTreeError != null
        assert moneyTreeError.getTimestamp() != null
        assert moneyTreeError.getStatus() == status
        assert moneyTreeError.getMessage() == message
        assert moneyTreeError.getDebugMessage() == throwable.getLocalizedMessage()
    }

    @Test
    def "It should create an error"() {
        given: "status and message"
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR
        String message = "Error authenticating with Alpaca"

        when: "create the error"
        MoneyTreeError moneyTreeError = MoneyTreeError.createError(status, message)

        then: "it should be created"
        assert moneyTreeError != null
        assert moneyTreeError.getStatus() == status
        assert moneyTreeError.getMessage() == message
    }
}
