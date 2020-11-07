package com.capstone.moneytree.dao;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.capstone.moneytree.model.node.Transaction;

@Repository
public interface TransactionDao extends Neo4jRepository<Transaction, Long> {
   List<Transaction> findAll();

   Transaction findTransactionById(Long id);
}
