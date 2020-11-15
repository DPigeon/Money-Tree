package com.capstone.moneytree.service.impl;

import java.util.LinkedHashMap;

import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import com.capstone.moneytree.utils.MoneyTreePasswordEncryption;
import com.capstone.moneytree.validator.UserValidator;
import com.capstone.moneytree.validator.ValidatorFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * {@inheritDoc}
 */
@Service
@Transactional
public class DefaultUserService implements UserService {

   private static final String USER_NOT_FOUND = "The requested user was not found";

   private final UserDao userDao;
   private final ValidatorFactory validatorFactory;
   private final MoneyTreePasswordEncryption passwordEncryption;
   private static final Logger LOG = LoggerFactory.getLogger(DefaultUserService.class);

   @Autowired
   public DefaultUserService(UserDao userDao, ValidatorFactory validatorFactory) {
      this.userDao = userDao;
      this.validatorFactory = validatorFactory;
      this.passwordEncryption = new MoneyTreePasswordEncryption();
   }

   @Override
   public Iterable<User> getAllUsers() {
      return userDao.findAll();
   }

   @Override
   public User getUserById(Long id) {
      User user = userDao.findUserById(id);
      if (user == null) {
         throw new EntityNotFoundException(USER_NOT_FOUND);
      }
      return user;
   }

   @Override
   public User getUserByEmailAndUsername(String email, String username) {
      User existingUser = userDao.findUserByEmailAndUsername(email, username);
      if (existingUser == null) {
         throw new EntityNotFoundException(USER_NOT_FOUND);
      }
      LOG.info("Found user with email {}", existingUser.getEmail());
      return existingUser;
   }

   @Override
   public User createUser(User user) {
      getUserValidator().validate(user);

      String password = user.getPassword();
      String encryptedPassword = encryptData(password);
      user.setPassword(encryptedPassword);

      userDao.save(user);

      LOG.info("Created user: {}", user.getFirstName());

      return user;
   }

   @Override
   public User registerAlpacaApiKey(User userWithKey) {
      String key = userWithKey.getAlpacaApiKey();
      String email = userWithKey.getEmail();
      String username = userWithKey.getUsername();
      User userToUpdate = userDao.findUserByEmailAndUsername(email, username);
      if (userToUpdate != null) {
         userToUpdate.setAlpacaApiKey(key);
         userDao.save(userToUpdate);
         LOG.info("Registered Alpaca key for user email {}", userToUpdate.getEmail());
      }
      return userToUpdate;
   }

   @Override
   public UserValidator getUserValidator() {
      return validatorFactory.getUserValidator();
   }

   public String encryptData(String text) {
      return passwordEncryption.toGraphProperty(text);
   }

   public boolean compareDigests(String plainPassword, String encryptedPassword) {
      return passwordEncryption.checkPassword(plainPassword, encryptedPassword);
   }
}
