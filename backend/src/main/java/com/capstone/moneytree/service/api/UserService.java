package com.capstone.moneytree.service.api;

import java.util.List;
import javax.security.auth.login.CredentialNotFoundException;

import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.model.SanitizedUser;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.validator.UserValidator;

import java.util.Map;

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

    User getUserByUsername(String username);

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

    Long followUser(Long userId, Long userToFollowId);

    Long unfollowUser(Long userId, Long userToUnfollowId);

    List<SanitizedUser> getFollowings(Long userId);

    List<SanitizedUser> getFollowers(Long userId);

    List<Map<String, String>> getSearchUsers();

    void deleteUserByEmail(String email);

    List<User> getTopUsers(String symbol);

    List<User> getFollowersWhoOwnsTheStock(Long id, String symbol);
}
