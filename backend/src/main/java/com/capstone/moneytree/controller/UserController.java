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

import java.util.ArrayList;
import java.util.List;

@MoneyTreeController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
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
     * @param userWithKey User with the Alpaca key
     * @return The new updated user from the database
     */
    @PostMapping("/register-alpaca-key")
    public ResponseEntity<User> registerAlpacaApiKey(@RequestBody User userWithKey) {
        String key = userWithKey.getAlpacaApiKey();

        // TODO: Refactor this into a validation class validateString method to validate strings & message class too
        if (StringUtils.isBlank(key)) {
            throw new IllegalArgumentException();
        }
        User updatedUser = userService.registerAlpacaApiKey(userWithKey);

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

    @GetMapping("/{id}")
    User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
