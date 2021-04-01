package com.capstone.moneytree.exception;

/**
 * Thrown when an entity has missing fields (either null or empty).
 * */
public class MissingMandatoryFieldException extends RuntimeException {

   public MissingMandatoryFieldException(String message) {
      super(message);
   }
}