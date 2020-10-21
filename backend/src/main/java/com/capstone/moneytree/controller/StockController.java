package com.capstone.moneytree.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.moneytree.facade.StockMarketDataFacade;
import com.capstone.moneytree.service.api.StockService;

@RestController
public class StockController extends ApiController {

   private StockMarketDataFacade stockMarketDataFacade;
   private StockService stockService;
   private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

   @Autowired
   public StockController(StockService stockService){
      this.stockService = stockService;
   }

}
