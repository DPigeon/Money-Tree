package com.capstone.moneytree.controller;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.exception.InvalidMediaFileException;
import com.capstone.moneytree.handler.ExceptionMessage;
import com.capstone.moneytree.model.SanitizedUser;
import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.UserCompleteProfile;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.StockService;
import com.capstone.moneytree.service.api.TransactionService;
import com.capstone.moneytree.service.api.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.security.auth.login.CredentialNotFoundException;
import javax.validation.Valid;
import java.util.*;

@MoneyTreeController
@RequestMapping("/users")
public class UserController extends AbstractController {

   private final UserService userService;
   private final TransactionService transactionService;
   private final StockService stockService;

   @Autowired
   public UserController(UserService userService, TransactionService transactionService, StockService stockService) {
      this.userService = userService;
      this.transactionService = transactionService;
      this.stockService = stockService;
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

      LOGGER.info("Returning {} users", users.size());

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
    * @param id   The user ID sent from the frontend
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
    * A method that returns a complete profile for user with the list of follows, transactions, ownedStocks, etc
    * @param username   The username sent from frontend
    * @return The complete user info for profile page
    */
   @GetMapping("/profile/{username}")
   UserCompleteProfile getUserByUsername(@PathVariable String username) {
      User user = userService.getUserByUsername(username);
      UserCompleteProfile completeUserProfile = new UserCompleteProfile(user);
      completeUserProfile.setFollowers(userService.getFollowers(user.getId()));
      completeUserProfile.setFollowing(userService.getFollowings(user.getId()));
      completeUserProfile.setTransactions(transactionService.getUserTransactions(user.getId()));
      completeUserProfile.setOwnedStocks(stockService.getUserStocks(user.getId()));
      return completeUserProfile;
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
    * 
    * @param userId         The ID of the user that is following a user
    * @param userToFollowId The ID of the user to follow
    * @return A response object
    */

   @PostMapping("/{userId}/follow/{userToFollowId}")
   ResponseEntity<Long> followUser(@PathVariable Long userId, @PathVariable Long userToFollowId) {
      Long res = this.userService.followUser(userId, userToFollowId);
      return ResponseEntity.ok(res);
   }

   /**
    * Unfollowing a user endpoint
    * 
    * @param userId           The ID of the user that is following a user
    * @param userToUnfollowId The ID of the user to unfollow
    * @return A response object
    */

   @DeleteMapping("/{userId}/unfollow/{userToUnfollowId}")
   ResponseEntity<Long> unfollowUser(@PathVariable Long userId, @PathVariable Long userToUnfollowId) {
      Long res = this.userService.unfollowUser(userId, userToUnfollowId);
      return ResponseEntity.ok(res);
   }

   @GetMapping("/followings/{id}")
   List<SanitizedUser> getFollowings(@PathVariable Long id) {
      return userService.getFollowings(id);
   }

   @GetMapping("/followers/{id}")
   List<SanitizedUser> getFollowers(@PathVariable Long id) {
      return userService.getFollowers(id);
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

   @GetMapping("/search")
   public ResponseEntity<List<Map<String, String>>> getSearchUsers() {
      return ResponseEntity.ok(userService.getSearchUsers());
   }

   @GetMapping("/{symbol}/top")
   public ResponseEntity<List<User>> getTopUserForStock(@PathVariable String symbol) {
      return ResponseEntity.ok(userService.getTopUsers(symbol));
   }

   @GetMapping("/{id}/owned_by_followers/{symbol}")
   public ResponseEntity<List<User>> getStockOwnedByFollowers(@PathVariable Long id, @PathVariable String symbol) {
      return ResponseEntity.ok(userService.getFollowersWhoOwnsTheStock(id, symbol));
   }

   @GetMapping("/leaderboard")
   public ResponseEntity<List<SanitizedUser>> getLeaderboard() {
      return ResponseEntity.ok(userService.getLeaderboard());
   }

   @GetMapping("/{userId}/timeline")
   public ResponseEntity<List<Map<SanitizedUser, Transaction>>> getTimeline(@PathVariable Long userId){
      List<Map<SanitizedUser,Transaction>> list = new ArrayList<>();
      // get followings
      this.userService.getFollowings(userId).stream()
              // foreach followings: get completed transactions
              .forEach(user -> {
                  this.transactionService.getUserTransactions(user.getId()).stream()
                          .filter(t -> t.getStatus() == TransactionStatus.COMPLETED)
                          //foreach transactions: add to list along with user info
                          .forEach(transaction -> {
                             list.add(Map.of(user, transaction));
                          });
              });
      // sort by transaction date desc
      list.sort((map1, map2) ->
              map2.entrySet().stream().findFirst().get().getValue().getPurchasedAt().compareTo(
              map1.entrySet().stream().findFirst().get().getValue().getPurchasedAt()
      ));
      return ResponseEntity.ok(list);
   }
}
