package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.node.User;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * User Data Access extending from our Neo4jRepository Database
 */
@Repository
public interface UserDao extends Neo4jRepository<User, Long> {

    User findUserById(Long id);
    User findUserByEmailAndUsername(String email, String username);
    User findUserByEmail(String email);
    User findUserByUsername(String username);
    List<User> findAll();

    @Query("MATCH (u:User) RETURN toString(ID(u)) as id, u.email as email, u.firstName as firstName, u.lastName as lastName, u.username as username, u.avatarURL as avatarURL")
    List<Map<String, String>> getSearchUsers();
}
