package com.capstone.moneytree.controller;

import java.util.ArrayList;
import java.util.List;

import javax.security.auth.login.CredentialNotFoundException;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.exception.InvalidMediaFileException;
import com.capstone.moneytree.handler.ExceptionMessage;
import com.capstone.moneytree.model.SanitizedUser;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;

@MoneyTreeController
@RequestMapping("/users")
public class UserController {

   private final UserService userService;
   private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

   @Autowired
   public UserController(UserService userService) {
      this.userService = userService;
   }

   /**
    * A GET method that fetches all users present within the database
    *
    * @return A proper response with a list of users
    */
   @GetMapping
   List<User> all() {
      List<User> users = new ArrayList<>();

      userService.getAllUsers().forEach(users::add);

      LOG.info("Returning {} users", users.size());

      return users;
   }

   /**
    * A POST method that receives a user JSON object and registers it
    *
    * @param user The JSON object body
    * @return A proper response with the URI of the newly created user
    */
   @PostMapping("/")
   public ResponseEntity<User> createUser(@RequestBody User user) {
      User createdUser = userService.createUser(user);

      return ResponseEntity.ok(createdUser);
   }

   /**
    * A method that updates a user with a new Alpaca key. This should be done only
    * once at beginning
    *
    * @param id  The user ID sent from the frontend
    * @param code The Alpaca API code sent from the frontend
    * @return The new updated user from the database
    */
   @PostMapping("/{id}/register-alpaca-key/{code}")
   public ResponseEntity<User> registerAlpacaApiKey(@Valid @PathVariable Long id, @Valid @PathVariable String code) {
      User updatedUser = userService.registerAlpacaApiKey(id, code);
      return ResponseEntity.ok(updatedUser);
   }

   @GetMapping("/{id}")
   User getUser(@PathVariable Long id) {
      return userService.getUserById(id);
   }

   /**
    * /login POST endpoint to authenticate a user
    *
    * @param credentials A User object with email and unencrypted password
    * @return The full User object from the database if login is successful with
    *         200 OK, 404 NOT_FOUND otherwise
    */
   @PostMapping("/login")
   public User login(@RequestBody User credentials) throws CredentialNotFoundException {
      return userService.login(credentials);
   }

   @PatchMapping("/{id}")
   ResponseEntity<User> editUserProfile(@PathVariable Long id, @RequestBody User user) {
      User userToUpdate = this.userService.getUserById(id);
      User updatedUser = this.userService.updateUser(userToUpdate, user);
      return ResponseEntity.ok(updatedUser);
   }

   @PostMapping("/profile-picture/{id}")
   ResponseEntity<User> editUserProfilePicture(@PathVariable Long id,
         @RequestParam(required = false) MultipartFile imageFile, @RequestParam String selection) {
      User userToUpdate = this.userService.getUserById(id);
      if (imageFile == null || imageFile.isEmpty()) {
         throw new InvalidMediaFileException("The provided profile picture is null or empty");
      }
      return ResponseEntity.ok(this.userService.editUserProfilePicture(userToUpdate, imageFile, selection));
   }

   /**
    * Following a user endpoint
    * @param userId The ID of the user that is following a user
    * @param userToFollowId The ID of the user to follow
    * @return A response object
    */

   @PostMapping("/{userId}/follow/{userToFollowId}")
   ResponseEntity<String> followUser(@PathVariable Long userId, @PathVariable Long userToFollowId) {
      String res = this.userService.followUser(userId, userToFollowId);

      return ResponseEntity.ok(res);
   }

   /**
    * Unfollowing a user endpoint
    * @param userId The ID of the user that is following a user
    * @param userToUnfollowId The ID of the user to unfollow
    * @return A response object
    */

   @DeleteMapping("/{userId}/unfollow/{userToUnfollowId}")
   ResponseEntity<String> unfollowUser(@PathVariable Long userId, @PathVariable Long userToUnfollowId) {
      String res = this.userService.unfollowUser(userId, userToUnfollowId);

      return ResponseEntity.ok(res);
   }

   @DeleteMapping("/delete-by-email/{email}")
   public ResponseEntity<Void> deleteUserByEmail(@Valid @PathVariable String email) {
      try {
         userService.deleteUserByEmail(email);
         return ResponseEntity.noContent().build();
      } catch (Exception e) {
         throw new EntityNotFoundException(ExceptionMessage.ENTITY_NOT_FOUND.getMessage());
      }
   }
   
   @GetMapping("/followings/{id}")
   List<SanitizedUser> getFollowings(@PathVariable Long id) {
      return userService.getFollowings(id);
   }

   @GetMapping("/followers/{id}")
   List<SanitizedUser> getFollowers(@PathVariable Long id) {
      return userService.getFollowers(id);
   }

}
