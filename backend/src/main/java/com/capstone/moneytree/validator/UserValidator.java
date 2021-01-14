package com.capstone.moneytree.validator;

import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.exception.MissingMandatoryFieldException;
import com.capstone.moneytree.exception.UserAlreadyExistsException;
import com.capstone.moneytree.model.node.User;

@Component
public class UserValidator implements Validator {
   private static final Logger LOG = LoggerFactory.getLogger(UserValidator.class);

   private final UserDao userDao;

   @Autowired
   public UserValidator(UserDao userDao) {
      this.userDao = userDao;
   }

   @Override
   public boolean supports(Class<?> aClass) {
      return User.class.equals(aClass);
   }

   @Override
   public void validate(Object var1) {
      User userToValidate = (User) var1;
      validateEmptyFields(userToValidate);
      validateEmailAndUsername(userToValidate);
   }

   public void validateEmailAndUsername(User user) {
      if (emailAlreadyExists(user)) {
         String errorMessage = "The email address already exist!";
         LOG.error(errorMessage);
         throw new UserAlreadyExistsException(errorMessage);
      } else if (usernameAlreadyExists(user)) {
         String errorMessage = "The username already exist!";
         LOG.error(errorMessage);
         throw new UserAlreadyExistsException(errorMessage);
      }
   }

   public void validateEmptyFields(User user) {
      if (StringUtils.isBlank(user.getPassword()) || StringUtils.isBlank(user.getUsername())
            || StringUtils.isBlank(user.getEmail()) || StringUtils.isBlank(user.getFirstName())
            || StringUtils.isBlank(user.getLastName())) {
         throw new MissingMandatoryFieldException(String.format("Missing field for %s", User.class));
      }
   }

   /**
    * Method to look if user exists with unique email address.
    *
    * @param user User from front end.
    * @return boolean if exists or not.
    */
   private boolean emailAlreadyExists(User user) {
      return Objects.nonNull(getUserDao().findUserByEmail(user.getEmail()));
   }

   /**
    * Method to look if user exists with unique username.
    *
    * @param user User from front end.
    * @return boolean if exists or not.
    */
   private boolean usernameAlreadyExists(User user) {
      return Objects.nonNull(getUserDao().findUserByUsername(user.getUsername()));
   }

   public UserDao getUserDao() {
      return userDao;
   }
}