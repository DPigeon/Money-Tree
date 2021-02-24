package com.capstone.moneytree.handler

import com.capstone.moneytree.exception.AlpacaException
import com.capstone.moneytree.exception.BadRequestException
import com.capstone.moneytree.exception.ExceptionAmazonS3
import com.capstone.moneytree.exception.InvalidMediaFileException
import com.capstone.moneytree.exception.MissingMandatoryFieldException

import javax.security.auth.login.CredentialNotFoundException

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.exception.UserAlreadyExistsException

import com.capstone.moneytree.utils.MoneyTreeErrorTest

import javassist.NotFoundException
import spock.lang.Specification

class RestHandlerExceptionTest extends Specification {

   def exceptionHandler = new RestExceptionHandler()

   def "When a BadRequestException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "bad request"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleBadRequestException(new BadRequestException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.BAD_REQUEST_MESSAGE.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When an ExceptionAmazonS3 ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error on Amazon S3"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleFailedUploadImageS3(new ExceptionAmazonS3(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.FAILED_TO_UPLOAD_S3.getMessage()
      apiError.getBody().getStatus() == HttpStatus.INTERNAL_SERVER_ERROR
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a EntityNotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleEntityNotFound(new EntityNotFoundException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.ENTITY_NOT_FOUND.getMessage()
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a IllegalArgumentException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleIllegalArgument(new IllegalArgumentException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.ILLEGAL_ARGUMENT.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a NotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "not found"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleNotFound(new NotFoundException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.REQUEST_NOT_FOUND.getMessage()
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a NullPointerException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "null pointer in result"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleNullPointer(new NullPointerException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.NULL_POINTER.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a UserAlreadyExistsException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "user already exists"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleUserAlreadyExists(new UserAlreadyExistsException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.USER_ALREADY_EXISTS.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a MissingMandatoryFieldException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "missing mandatory field"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleMissingMandatoryField(new MissingMandatoryFieldException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.MISSING_FIELDS.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a InvalidMediaFileException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "user already exists"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleInvalidMediaFileException(new InvalidMediaFileException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.FAILED_TO_UPLOAD_S3.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a CredentialNotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "credential not found"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleCredentialNotFound(new CredentialNotFoundException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
      apiError.getBody().getMessage() == ExceptionMessage.CREDENTIALS_NOT_FOUND.getMessage()
   }

   def "When a AlpacaException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "internal Alpaca error"

      when:
      ResponseEntity<MoneyTreeErrorTest> apiError = exceptionHandler.handleAlpacaException(new AlpacaException(errorMessage)) as ResponseEntity<MoneyTreeErrorTest>

      then:
      apiError.getBody().getStatus() == HttpStatus.INTERNAL_SERVER_ERROR
      apiError.getBody().getDebugMessage() == errorMessage
      apiError.getBody().getMessage() == ExceptionMessage.ALPACA_ERROR.getMessage()
   }
}