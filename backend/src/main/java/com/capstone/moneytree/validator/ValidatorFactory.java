package com.capstone.moneytree.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * This class is responsible to create the validators for the
 * different entities within our domain model.
 * */
@Component
public class ValidatorFactory {

   private final UserValidator userValidator;

   @Autowired
   public ValidatorFactory(UserValidator userValidator) {
      this.userValidator = userValidator;
   }

   public UserValidator getUserValidator() {
      return this.userValidator;
   }
}