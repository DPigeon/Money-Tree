package com.capstone.moneytree.controller;

import com.capstone.moneytree.service.api.StockMarketDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.capstone.moneytree.service.api.StockService;
import pl.zankowski.iextrading4j.api.stocks.Quote;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@RestController
@RequestMapping("/api/stockmarket")
public class StockController extends ApiController {

   private StockService stockService;
   @Autowired
   private StockMarketDataService stockMarketDataService;
   private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

   @Autowired
   public StockController(StockService stockService){
      this.stockService = stockService;
   }

   @GetMapping("/quote/{symbol}")
   public ResponseEntity<Quote> getQuote(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      Quote quote = stockMarketDataService.getQuoteBySymbol(symbol);
      return ResponseEntity.ok(quote);
   }

   //not available for free tier...
   @GetMapping("/batch/{symbols}")
   public ResponseEntity<BatchStocks> getBatchBySymbols(@Valid @PathVariable(name = "symbols") String symbols) {
      BatchStocks batchStocks = stockMarketDataService.getBatchStocksBySymbols(symbols);
      return ResponseEntity.ok(batchStocks);
   }


}
