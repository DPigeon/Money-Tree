package com.capstone.moneytree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.domain.alpaca.order.Order;


@MoneyTreeController
@RequestMapping("/transactions")
public class TransactionController {

   private final TransactionService transactionService;

   @Autowired
   public TransactionController(TransactionService transactionService) {
      this.transactionService = transactionService;
   }

   /**
    * An order needs these fields:
    * <p>
    * {
    * "symbol": "aapl" //symbol or asset ID to identify the asset to trade
    * "qty" : "3" // number of shares to trade
    * "side" : "buy" // could be buy or sell
    * "type": "market" // market, limit, stop, stop_limit, or trailing_stop
    * "time_in_force": ""
    * }
    */
   @PostMapping("/execute/{userId}")
   public Transaction executeTransaction(@RequestParam Long userId, @RequestBody Order order) {
      return this.transactionService.execute(userId, order);
   }
}
