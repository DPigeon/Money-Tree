package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.node.Transaction;
import net.jacobpeterson.domain.alpaca.order.Order;

public interface TransactionService {

    List<Transaction> getAllTransactions();
    List<Transaction> getTransactionsByOrderType(MoneyTreeOrderType moneyTreeOrderType);

    /**
     * This method executes a transaction through Alpaca API given an order.
     *
     * @param order The order to execute
     * @return the User that executed the transaction
     **/
    List<Transaction> execute(String userId, Order order);
    List<Transaction> getUserTransactions(Long userId);
}
