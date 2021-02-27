package com.capstone.moneytree.dao.RelationshipDao;

import com.capstone.moneytree.model.relationship.Owns;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Owns relationship entity Data Access Object extending Neo4jRepository
 * Database
 */
@Repository
public interface OwnsDao extends Neo4jRepository<Owns, Long> {

    List<Owns> findAll();

    List<Owns> findByStockId(Long stockId);

    List<Owns> findByUserId(Long UserId);

    List<Owns> findByUserIdAndStockId(Long UserId, Long stockId);

}
