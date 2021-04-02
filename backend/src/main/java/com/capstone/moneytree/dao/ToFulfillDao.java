package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.relationship.ToFulfill;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ToFulfill relationship entity Data Access Object extending Neo4jRepository
 * Database
 */
@Repository
public interface ToFulfillDao extends Neo4jRepository<ToFulfill, Long> {

    ToFulfill findByTransactionId(Long transactionId);
    List<ToFulfill> findAll();
    List<ToFulfill> findByStockId(Long stockId);
    List<ToFulfill> findByTransactionIdAndStockId(Long transactionId, Long stockId);
}
