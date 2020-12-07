package com.capstone.moneytree.handler;

import static com.capstone.moneytree.handler.ExceptionMessage.*;
import static org.springframework.http.HttpStatus.*;

import com.capstone.moneytree.exception.ExceptionAmazonS3;
import com.capstone.moneytree.exception.MissingMandatoryFieldException;
import com.capstone.moneytree.exception.ExceptionAmazonS3;
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException;

import javassist.NotFoundException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.utils.MoneyTreeError;

import javax.security.auth.login.CredentialNotFoundException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

   private ResponseEntity<MoneyTreeError> buildResponseEntity(MoneyTreeError apiError) {
      return new ResponseEntity<>(apiError, apiError.getStatus());
   }

   @ExceptionHandler(ExceptionAmazonS3.class)
   protected ResponseEntity<MoneyTreeError> handleFailedUploadImageS3(
           ExceptionAmazonS3 ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(INTERNAL_SERVER_ERROR)
              .debugMessage(ex.getMessage())
              .message(FAILED_TO_UPLOAD_S3.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

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

   @ExceptionHandler(UserAlreadyExistsException.class)
   protected ResponseEntity<MoneyTreeError> handleUserAlreadyExists(
           UserAlreadyExistsException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(BAD_REQUEST)
              .debugMessage(ex.getMessage())
              .message(USER_ALREADY_EXISTS.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

   @ExceptionHandler(MissingMandatoryFieldException.class)
   protected ResponseEntity<MoneyTreeError> handleMissingMandatoryField(
           MissingMandatoryFieldException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(BAD_REQUEST)
              .debugMessage(ex.getMessage())
              .message(MISSING_FIELDS.getMessage())
              .build();
      return buildResponseEntity(apiError);
   }

   /**
    * Exception Handler for CredentialNotFoundException
    *
    * @param ex A CredentialNotFoundException
    * @return 404 NOT FOUND
    */
   @ExceptionHandler(CredentialNotFoundException.class)
   protected ResponseEntity<MoneyTreeError> handleCredentialNotFound(CredentialNotFoundException ex) {
      MoneyTreeError apiError = MoneyTreeError.builder()
              .status(NOT_FOUND)
              .debugMessage(ex.getMessage())
              .message(NOT_FOUND.getReasonPhrase())
              .build();
      return buildResponseEntity(apiError);
   }
}