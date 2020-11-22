package com.capstone.moneytree.controller;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.handler.ExceptionMessage;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;


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
     * @param user The JSON object body
     * @return A proper response with the URI of the newly created user
     */
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);

        URI userURI = ServletUriComponentsBuilder.fromCurrentContextPath().
                path("/users/{id}").
                buildAndExpand(createdUser.getId()).toUri();

        return ResponseEntity.created(userURI).build();
    }

    /**
     * A method that updates a user with a new Alpaca key. This should be done only once at beginning
     * @param id The user ID sent from the frontend
     * @param key The Alpaca API key sent from the frontend
     * @return The new updated user from the database
     */
    @PostMapping("/{id}/register-alpaca-key/{key}")
    public ResponseEntity<User> registerAlpacaApiKey(@Valid @PathVariable Long id, @Valid @PathVariable String key) {
        User updatedUser = userService.registerAlpacaApiKey(id, key);

        if (updatedUser == null) {
            throw new EntityNotFoundException(ExceptionMessage.ENTITY_NOT_FOUND.getMessage());
        }

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{id}")
    User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
