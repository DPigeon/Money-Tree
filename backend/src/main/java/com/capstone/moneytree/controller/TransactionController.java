package com.capstone.moneytree.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.domain.alpaca.order.Order;

@MoneyTreeController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * A GET method that fetches all transactions present within the database
     *
     * @return A proper response with a list of all transactions
     */
    @GetMapping
    List<Transaction> all() {
        List<Transaction> transactions = new ArrayList<>();

        transactionService.getAllTransactions().forEach(transactions::add);

        LOG.info("Returning {} transactions", transactions.size());

        return transactions;
    }

    /**
     * An order needs these fields:
     * <p>
     * { "symbol": "AAPL" //symbol or asset ID to identify the asset to trade "qty"
     * : "3" // number of shares to trade "side" : "buy" // could be buy or sell
     * "type": "market" // market, limit, stop, stop_limit, or trailing_stop
     * "time_in_force": "" }
     */
    @PostMapping("/execute/{userId}")
    public List<Transaction> executeTransaction(@PathVariable String userId, @RequestBody Order order) {
        return this.transactionService.execute(userId, order);
    }

    /**
     * A GET method that fetches all transactions for a particular user
     *
     * @return A proper response with a list of all transactions for that user
     */
    @GetMapping("/{userId}")
    List<Transaction> getUserTransactions(@PathVariable String userId) {
        List<Transaction> userTransactions =
                transactionService.getUserTransactions(Long.parseLong(userId));

        LOG.info("Returning {} transactions", userTransactions.size());

        return userTransactions;
    }

}
