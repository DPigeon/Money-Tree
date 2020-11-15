package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import com.capstone.moneytree.utils.MoneyTreePasswordEncryption;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DefaultUserService implements UserService {

    private final UserDao userDao;
    private final MoneyTreePasswordEncryption passwordEncryption;
    private static final Logger LOG = LoggerFactory.getLogger(DefaultUserService.class);

    @Autowired
    public DefaultUserService(UserDao userDao) {
        this.userDao = userDao;
        this.passwordEncryption = new MoneyTreePasswordEncryption();
    }

    @Override
    public Iterable<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public User getUserById(Long id) {
        LOG.info("Retrieved user ID {}", id);
        return userDao.findUserById(id);
    }

    /**
     * Find a unique User with email and username
     * @param email The email of the user
     * @param username The username of the user
     * @return The User in the database
     */
    @Override
    public User getUserByEmailAndUsername(String email, String username) {
        List<User> userList = userDao.findAll();
        User userToFind = null;

        for (User user : userList) {
            if (email.equalsIgnoreCase(user.getEmail()) || username.equalsIgnoreCase(user.getUsername())) {
                userToFind = user;
                LOG.info("Found user with email {}", user.getEmail());
                break;
            }
        }

        return userToFind;
    }

    @Override
    public User createUser(User user) {
        String password = user.getPassword();
        String encryptedPassword = encryptData(password);
        user.setPassword(encryptedPassword);
        userDao.save(user);
        LOG.info("Created user: {}", user.getFirstName());

        return user;
    }

    /**
     * Method to look if user exists with unique email and username.
     * @param email The email coming from the frontend.
     * @param username The username coming from the frontend.
     * @return boolean if exists or not.
     */
    @Override
    public boolean userExists(String email, String username) {
        boolean exists = false;
        User user = userDao.findUserByEmailAndUsername(email, username);

        if (user != null) {
            exists = true;
            LOG.info("User already exists.");
        }
        return exists;
    }

    @Override
    public User registerAlpacaApiKey(Long id, String key) {
        User userToUpdate = userDao.findUserById(id);
        if (userToUpdate != null) {
            userToUpdate.setAlpacaApiKey(key);
            userDao.save(userToUpdate);
            LOG.info("Registered Alpaca key for user email {}", userToUpdate.getEmail());
        }

        return userToUpdate;
    }

    /**
     * A method to verify given credentials against existing user records
     * @param credentials A User object with email and unencrypted password
     * @return The full User object from the database if login is successful, null otherwise
     */
    @Override
    public User login(User credentials) {
        User user = userDao.findUserByEmail(credentials.getEmail());
        if(compareDigests(credentials.getPassword(), user.getPassword())){
            return user;
        }else{
            return null;
        }
    }

    public String encryptData(String text) {
        return passwordEncryption.toGraphProperty(text);
    }

    public boolean compareDigests(String plainPassword, String encryptedPassword) {
        return passwordEncryption.checkPassword(plainPassword, encryptedPassword);
    }
}
