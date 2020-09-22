package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DefaultUserService implements UserService {

    private final UserDao userDao;
    private static final Logger LOG = LoggerFactory.getLogger(DefaultUserService.class);

    @Autowired
    public DefaultUserService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public Iterable<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userDao.findUserById(id);
    }

    @Override
    public User createUser(User user) {

        User createdUser = userDao.save(user);

        LOG.info("Created user: {}", createdUser.getFirstName());

        return createdUser;
    }
}
