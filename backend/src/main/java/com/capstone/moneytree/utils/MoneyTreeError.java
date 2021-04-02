package com.capstone.moneytree.utils;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class MoneyTreeError {

   private HttpStatus status;
   @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
   private LocalDateTime timestamp;
   private String message;
   private String debugMessage;

   MoneyTreeError() {
      timestamp = LocalDateTime.now();
   }

   MoneyTreeError(HttpStatus status) {
      this();
      this.status = status;
   }

   MoneyTreeError(HttpStatus status, Throwable ex) {
      this();
      this.status = status;
      this.message = "Unexpected error";
      this.debugMessage = ex.getLocalizedMessage();
   }

   public MoneyTreeError(HttpStatus status, String message, Throwable ex) {
      this();
      this.status = status;
      this.message = message;
      this.debugMessage = ex.getLocalizedMessage();
   }

   static MoneyTreeError createError(HttpStatus status, String message) {
      return MoneyTreeError.builder()
              .message(message)
              .status(status)
              .build();
   }
}