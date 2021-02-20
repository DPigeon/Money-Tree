package com.capstone.moneytree.service.api;

import java.util.List;
import javax.security.auth.login.CredentialNotFoundException;

import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.model.SanitizedUser;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.validator.UserValidator;

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

   User updateUser(User userToUpdate, User user);

   User registerAlpacaApiKey(Long id, String key);

   UserValidator getUserValidator();

   User login(User credentials) throws CredentialNotFoundException;

   User editUserProfilePicture(User user, MultipartFile imageFile, String selection);

   String followUser(Long userId, Long userToFollowId);
   
   String unfollowUser(Long userId, Long userToUnfollowId);

   List<SanitizedUser> getFollowings(Long userId);
   
   List<SanitizedUser> getFollowers(Long userId);

   void deleteUserByEmail(String email);

}
