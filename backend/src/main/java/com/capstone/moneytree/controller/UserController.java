package com.capstone.moneytree.controller;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.handler.ExceptionMessage;
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import org.apache.commons.lang.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.CredentialNotFoundException;
import java.util.ArrayList;
import java.util.List;

@MoneyTreeController
@RequestMapping
public class UserController {

   private final UserService userService;
   private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

   @Autowired
   public UserController(UserService userService) {
      this.userService = userService;
   }

   @GetMapping("/users")
   List<User> all() {
      List<User> users = new ArrayList<>();

      userService.getAllUsers().forEach(users::add);

      LOG.info("Returning {} users", users.size());

      return users;
   }

    /**
     * A POST method that receives a user JSON object and registers it
     * @param user The JSON object body
     * @return A proper response with message
     */
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        ResponseEntity<User> response = null;
        HttpStatus status = validateUserCreation(user);

        if (status == HttpStatus.OK) {
            User createdUser = userService.createUser(user);
            response = ResponseEntity.ok(createdUser);
        }

        return response;
    }

    /**
     * A method that updates a user with a new Alpaca key. This should be done only once at beginning
     * @param id The user ID sent from the frontend
     * @param key The Alpaca API key sent from the frontend
     * @return The new updated user from the database
     */
    @PostMapping("/register-alpaca-key/{id}/{key}")
    public ResponseEntity<User> registerAlpacaApiKey(@PathVariable Long id, @PathVariable String key) {
        // TODO: Refactor this into a validation class validateString method to validate strings & message class too
        if (StringUtils.isBlank(key)) {
            throw new IllegalArgumentException();
        }
        User updatedUser = userService.registerAlpacaApiKey(id, key);

        if (updatedUser == null) {
            throw new EntityNotFoundException(ExceptionMessage.ENTITY_NOT_FOUND.getMessage());
        }

        return ResponseEntity.ok(updatedUser);
    }

    HttpStatus validateUserCreation(User user) {
        String email = user.getEmail();
        String username = user.getUsername();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        // TODO: Refactor this into a validation class validateString method to validate strings & message class too
        if (StringUtils.isBlank(email) || StringUtils.isBlank(username) || StringUtils.isBlank(password) ||
                StringUtils.isBlank(firstName) || StringUtils.isBlank(lastName)) {
            throw new IllegalArgumentException();
        } else if (userService.userExists(email, username)) {
            throw new UserAlreadyExistsException(ExceptionMessage.USER_ALREADY_EXISTS.getMessage());
        }

        return HttpStatus.OK;
    }

   @GetMapping("/users/{id}")
   User getUser(@PathVariable Long id) {
      return userService.getUserById(id);
    }

    /**
     * /login POST endpoint to authenticate a user
     * @param credentials A User object with email and unencrypted password
     * @return The full User object from the database if login is successful with 200 OK, 404 NOT_FOUND otherwise
     */
    @PostMapping("/login")
    public User login(@RequestBody User credentials) throws CredentialNotFoundException {
        return userService.login(credentials);
    }
}
