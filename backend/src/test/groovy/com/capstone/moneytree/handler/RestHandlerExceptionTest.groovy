package com.capstone.moneytree.handler

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.utils.MoneyTreeError

import spock.lang.Specification


class RestHandlerExceptionTest extends Specification {

   public static final String ENTITY_NOT_FOUND = "Requested entity not found"

   def exceptionHandler = new RestExceptionHandler()

   def "When a EntityNotFoundException ex is thrown, handler is called"() {
      given: "A custom exception message"
      def errorMessage = "error message"

      when:
      ResponseEntity<MoneyTreeError> apiError = exceptionHandler.handleEntityNotFound(new EntityNotFoundException(errorMessage)) as ResponseEntity<MoneyTreeError>

      then:
      apiError.getBody().getMessage() == ENTITY_NOT_FOUND
      apiError.getBody().getStatus() == HttpStatus.NOT_FOUND
      apiError.getBody().getDebugMessage() == errorMessage
   }
}