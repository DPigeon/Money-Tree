package com.capstone.moneytree.dao.relationshipDao;

import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.relationship.Made;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * Made relationship entity Data Access Object class extending Neo4jRepository
 * Database
 */
@Repository
public interface MadeDao extends Neo4jRepository<Made, Long> {

    List<Made> findAll();

    Made findByTransactionId(Long transactionID);

    List<Made> findByTransactionDate(Date transactionDate);

    List<Made> findByUserId(Long userId);

    List<Made> findByTransactionStatus(TransactionStatus transactoinStatus);

}
