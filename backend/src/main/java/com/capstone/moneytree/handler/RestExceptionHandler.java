package com.capstone.moneytree.handler;

import static com.capstone.moneytree.handler.ExceptionMessage.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import javassist.NotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
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

   // Other exception handlers below
   @ExceptionHandler(EntityNotFoundException.class)
   protected ResponseEntity<MoneyTreeError> handleEntityNotFound(
           EntityNotFoundException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(NOT_FOUND)
              .debugMessage(ex.getMessage())
              .message(ENTITY_NOT_FOUND.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

   @ExceptionHandler(IllegalArgumentException.class)
   protected ResponseEntity<MoneyTreeError> handleIllegalArgument(
           IllegalArgumentException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(BAD_REQUEST)
              .debugMessage(ex.getMessage())
              .message(ILLEGAL_ARGUMENT.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

   @ExceptionHandler(NotFoundException.class)
   protected ResponseEntity<MoneyTreeError> handleNotFound(
           NotFoundException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(NOT_FOUND)
              .debugMessage(ex.getMessage())
              .message(REQUEST_NOT_FOUND.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

   @ExceptionHandler(NullPointerException.class)
   protected ResponseEntity<MoneyTreeError> handleNullPointer(
           NullPointerException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(BAD_REQUEST)
              .debugMessage(ex.getMessage())
              .message(NULL_POINTER.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }
}