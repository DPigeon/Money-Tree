package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.relationship.Follows;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Follows relationship entity Data Access extending from our Neo4jRepository Database
 */
@Repository
public interface FollowsDao extends Neo4jRepository<Follows, Long> {

    List<Follows> findAll();
    
}
