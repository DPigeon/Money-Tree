package com.capstone.moneytree.handler

import org.junit.Test
import spock.lang.Specification

class ExceptionMessageTest extends Specification {

    @Test
    def "It should get the exception messages"() {
        when: "Getting messages"
        String entityNotFound = ExceptionMessage.ENTITY_NOT_FOUND.getMessage()
        String illegalArgument = ExceptionMessage.ILLEGAL_ARGUMENT.getMessage()
        String requestNotFound = ExceptionMessage.REQUEST_NOT_FOUND.getMessage()
        String nullPointer = ExceptionMessage.NULL_POINTER.getMessage()
        String userAlreadyExists = ExceptionMessage.USER_ALREADY_EXISTS.getMessage()
        String missingFields = ExceptionMessage.MISSING_FIELDS.getMessage()
        String failedUploadS3 = ExceptionMessage.FAILED_TO_UPLOAD_S3.getMessage()
        String badRequestMessage = ExceptionMessage.BAD_REQUEST_MESSAGE.getMessage()
        String credentialNotFound = ExceptionMessage.CREDENTIALS_NOT_FOUND.getMessage()
        String alpacaError = ExceptionMessage.ALPACA_ERROR.getMessage()
        String alpacaClockError = ExceptionMessage.ALPACA_CLOCK_ERROR.getMessage()

        then: "It should be the right message"
        assert entityNotFound == ExceptionMessage.ENTITY_NOT_FOUND.message
        assert illegalArgument == ExceptionMessage.ILLEGAL_ARGUMENT.message
        assert requestNotFound == ExceptionMessage.REQUEST_NOT_FOUND.message
        assert nullPointer == ExceptionMessage.NULL_POINTER.message
        assert userAlreadyExists == ExceptionMessage.USER_ALREADY_EXISTS.message
        assert missingFields == ExceptionMessage.MISSING_FIELDS.message
        assert failedUploadS3 == ExceptionMessage.FAILED_TO_UPLOAD_S3.message
        assert badRequestMessage == ExceptionMessage.BAD_REQUEST_MESSAGE.message
        assert credentialNotFound == ExceptionMessage.CREDENTIALS_NOT_FOUND.message
        assert alpacaError == ExceptionMessage.ALPACA_ERROR.message
        assert alpacaClockError == ExceptionMessage.ALPACA_CLOCK_ERROR.message
    }
}
