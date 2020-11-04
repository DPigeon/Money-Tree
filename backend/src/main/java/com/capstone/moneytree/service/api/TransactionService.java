package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.OrderType;
import com.capstone.moneytree.model.node.Transaction;

public interface TransactionService {

   List<Transaction> getAllTransactions();

   Transaction getTransactionByOrderType(OrderType orderType);
}
