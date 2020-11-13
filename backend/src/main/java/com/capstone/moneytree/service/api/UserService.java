package com.capstone.moneytree.service.api;

import com.capstone.moneytree.model.node.User;

public interface UserService {

    Iterable<User> getAllUsers();

    User getUserById(Long id);

    User getUserByEmailAndUsername(String email, String username);

    User createUser(User user);

    boolean userExists(String email, String username);

    User registerAlpacaApiKey(User userWithKey);
}
