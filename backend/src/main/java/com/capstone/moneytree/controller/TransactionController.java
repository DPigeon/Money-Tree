package com.capstone.moneytree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;


@MoneyTreeController
@RequestMapping("/transactions")
public class TransactionController {

   @Autowired
   public TransactionController() {
      // Empty constructor for now
   }

}
