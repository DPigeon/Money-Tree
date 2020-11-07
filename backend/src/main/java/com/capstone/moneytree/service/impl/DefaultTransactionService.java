package com.capstone.moneytree.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.TransactionDao;
import com.capstone.moneytree.model.OrderType;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.service.api.TransactionService;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {

   private final TransactionDao transactionDao;
   private static final Logger LOG = LoggerFactory.getLogger(DefaultTransactionService.class);

   @Autowired
   public DefaultTransactionService(TransactionDao transactionDao) {
      this.transactionDao = transactionDao;
   }

   @Override
   public List<Transaction> getAllTransactions() {
      return transactionDao.findAll();
   }

   @Override
   public Transaction getTransactionByOrderType(OrderType orderType) {
      return null;
   }
}
