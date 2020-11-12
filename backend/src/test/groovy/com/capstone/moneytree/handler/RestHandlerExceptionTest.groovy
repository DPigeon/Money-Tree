package com.capstone.moneytree.handler

import javassist.NotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.utils.MoneyTreeError

import spock.lang.Specification


class RestHandlerExceptionTest extends Specification {

   def exceptionHandler = new RestExceptionHandler()

   def "When a EntityNotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeError> apiError = exceptionHandler.handleEntityNotFound(new EntityNotFoundException(errorMessage)) as ResponseEntity<MoneyTreeError>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.ENTITY_NOT_FOUND.getMessage()
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a IllegalArgumentException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeError> apiError = exceptionHandler.handleIllegalArgument(new IllegalArgumentException(errorMessage)) as ResponseEntity<MoneyTreeError>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.ILLEGAL_ARGUMENT.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a NotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeError> apiError = exceptionHandler.handleNotFound(new NotFoundException(errorMessage)) as ResponseEntity<MoneyTreeError>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.REQUEST_NOT_FOUND.getMessage()
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
   }

   def "When a NullPointerException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeError> apiError = exceptionHandler.handleNullPointer(new NullPointerException(errorMessage)) as ResponseEntity<MoneyTreeError>

      then:
      apiError.getBody().getMessage() == ExceptionMessage.NULL_POINTER.getMessage()
      apiError.getBody().getStatus() == HttpStatus.BAD_REQUEST
      apiError.getBody().getDebugMessage() == errorMessage
   }
}