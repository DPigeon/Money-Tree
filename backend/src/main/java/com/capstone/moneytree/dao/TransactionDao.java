package com.capstone.moneytree.dao;

import com.capstone.moneytree.model.node.Transaction;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;

import java.util.List;

@Repository
public interface TransactionDao extends Neo4jRepository<Transaction, Long> {

    List<Transaction> findAll();
    List<Transaction> findByStatus(TransactionStatus status);
    List<Transaction> findByMoneyTreeOrderType(MoneyTreeOrderType moneyTreeOrderType);
    Transaction findByClientOrderId(String clientOrderId);
    Transaction findTransactionById(Long id);
}
