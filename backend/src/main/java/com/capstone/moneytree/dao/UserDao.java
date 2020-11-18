package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.node.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * User Data Access extending from our Neo4jRepository Database
 */
@Repository
public interface UserDao extends Neo4jRepository<User, Long> {

    List<User> findAll();

    User findUserById(Long id);

    User findUserByEmailAndUsername(String email, String username);

    User findUserByEmail(String email);
}
