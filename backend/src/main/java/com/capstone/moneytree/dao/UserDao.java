package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.node.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao extends Neo4jRepository<User, Long> {

    List<User> findAll();

    User findUserById(Long id);
}