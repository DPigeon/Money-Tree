package com.capstone.moneytree.validator;


/**
 * The purpose of this class is to provide a common interface for all validator
 * classes for our entities.
 */
public interface Validator {

   /**
    * Checks if the validator supports the validation of the provided class
    *
    * @param var1 class to check for support
    * @return true if it supports the validation of var1 class, false otherwise
    */
   boolean supports(Class<?> var1);


   /**
    * Checks if all fields are valid and that the username or email does not exist.
    * Otherwise, throws an error if one of the two validations are not respected.
    *
    * @param var1 A class to validate
    */
   void validate(Object var1);
}
