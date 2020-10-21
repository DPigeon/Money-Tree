package com.capstone.moneytree.controller;


import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController extends ApiController{

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

    @PostMapping("/users")
    User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
