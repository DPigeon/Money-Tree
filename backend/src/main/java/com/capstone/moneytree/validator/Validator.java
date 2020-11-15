package com.capstone.moneytree.validator;

/**
 * The purpose of this class is to provide a common interface for all validator
 * classes for our entities.
 */
public interface Validator {
   boolean supports(Class<?> var1);

   void validate(Object var1);

   boolean isValid(Object var1);
}
