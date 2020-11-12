package com.capstone.moneytree.handler;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.utils.MoneyTreeError;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

   private ResponseEntity<MoneyTreeError> buildResponseEntity(MoneyTreeError apiError) {
      return new ResponseEntity<>(apiError, apiError.getStatus());
   }

   //other exception handlers below
   @ExceptionHandler(EntityNotFoundException.class)
   protected ResponseEntity<MoneyTreeError> handleEntityNotFound(
           EntityNotFoundException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(NOT_FOUND)
              .debugMessage(ex.getMessage())
              .message("Requested entity not found")
              .build();
      return buildResponseEntity(apiError);
   }

}