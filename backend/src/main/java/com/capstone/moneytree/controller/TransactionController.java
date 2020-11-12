package com.capstone.moneytree.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.moneytree.service.api.TransactionService;

@MoneyTreeController
public class TransactionController {

   private final TransactionService transactionService;
   private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

   @Autowired
   public TransactionController(TransactionService transactionService) {
      this.transactionService = transactionService;
   }

}
