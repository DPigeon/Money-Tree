package com.capstone.moneytree.exception;

public class EntityNotFoundException extends RuntimeException {

   public EntityNotFoundException(String message) {
      super(message);
   }
}