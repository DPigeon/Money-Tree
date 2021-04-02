package com.capstone.moneytree.exception;

/**
 * A unique exception that is thrown when the user uploads an invalid profile picture.
 */
public class InvalidMediaFileException extends RuntimeException {

   public InvalidMediaFileException(String message) {
      super(message);
   }
}
