package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

import net.jacobpeterson.domain.alpaca.order.Order;

public interface TransactionService {

   List<Transaction> getAllTransactions();

   Transaction getTransactionByOrderType(MoneyTreeOrderType moneyTreeOrderType);

   /**
    * This method executes a transaction through Alpaca API given an order.
    *
    * @param order The order to execute
    * @return the User that executed the transaction
    **/
   User execute(String userId, Order order);
}
