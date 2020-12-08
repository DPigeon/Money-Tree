package com.capstone.moneytree.service.api;

import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.validator.UserValidator;

import javax.security.auth.login.CredentialNotFoundException;

/**
 * User service for all user based interactions and business logic
 */
public interface UserService {

   /**
    * Gets all users from the database.
    *
    * @return the list of users. Empty list if none.
    */
   Iterable<User> getAllUsers();

   User getUserById(Long id);

   /**
    * Find a unique User with email and username
    *
    * @param email    The email of the user
    * @param username The username of the user
    * @return The User in the database
    */
   User getUserByEmailAndUsername(String email, String username);

   User createUser(User user);

   User registerAlpacaApiKey(Long id, String key);

   UserValidator getUserValidator();

   User login(User credentials) throws CredentialNotFoundException;

   void deleteUserByEmail(String email);
}
