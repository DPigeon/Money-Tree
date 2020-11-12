package com.capstone.moneytree.controller;

import com.capstone.moneytree.handler.ExceptionMessage;
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController extends ApiController {

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

    @PostMapping("/create-user")
    ResponseEntity<User> createUser(@RequestBody User user) {
        ResponseEntity<User> response = null;
        HttpStatus status = validateUserCreation(user);

        if (status == HttpStatus.OK) {
            User createdUser = userService.createUser(user);
            Optional<User> optional = Optional.of(createdUser);
            response = ResponseEntity.of(optional);
        }

        return response;
    }

    HttpStatus validateUserCreation(User user) {
        String email = user.getEmail();
        String username = user.getUsername();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        // TODO: Refactor this into a validation class validateString method to validate strings & message class too
        if (email.isEmpty() || email.isBlank() ||
                username.isEmpty() || username.isBlank() ||
                password.isEmpty() || password.isBlank() ||
                firstName.isEmpty() || firstName.isBlank() ||
                lastName.isEmpty() || lastName.isBlank()) {
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
}
