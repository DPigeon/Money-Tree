package com.capstone.moneytree.validator;

import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.capstone.moneytree.exception.MissingMandatoryFieldException;
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;

@Component
public class UserValidator implements Validator {

   private static final Logger LOG = LoggerFactory.getLogger(UserValidator.class);
   private UserService userService;

   @Autowired
   public UserValidator(UserService userService) {
      this.userService = userService;
   }

   @Override
   public boolean supports(Class<?> aClass) {
      return User.class.equals(aClass);
   }

   /**
    * Checks if all fields are valide and that the username or email does not exist.
    * Otherwise, throws an error if one of the two validations are not respected.
    * */
   @Override
   public void validate(Object var1) {
      User userToValidate = (User) var1;
      validateEmptyFields(userToValidate);
      validateEmailAndUsername(userToValidate);
   }

   @Override
   public boolean isValid(Object var1) {
      return false;
   }

   public void validateEmailAndUsername(User user) {
      if (userAlreadyExists(user)) {
         String errorMessage = "The email address or username already exist";
         LOG.error(errorMessage);
         throw new UserAlreadyExistsException(errorMessage);
      }
   }

   public void validateEmptyFields(User user) {
      if (StringUtils.isBlank(user.getPassword()) ||
              StringUtils.isBlank(user.getUsername()) ||
              StringUtils.isBlank(user.getEmail()) ||
              StringUtils.isBlank(user.getFirstName()) ||
              StringUtils.isBlank(user.getLastName())) {
         throw new MissingMandatoryFieldException(String.format("Missing field for %s", User.class));
      }
   }

   /**
    * Method to look if user exists with unique email and username.
    * @param user User from front end.
    * @return boolean if exists or not.
    */
   private boolean userAlreadyExists(User user) {
      return Objects.nonNull(userService.
              getUserByEmailAndUsername(user.getEmail(), user.getUsername()));
   }
}