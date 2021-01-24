package com.capstone.moneytree.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.capstone.moneytree.service.api.StockMarketDataService;

import pl.zankowski.iextrading4j.api.stocks.Book;
import pl.zankowski.iextrading4j.api.stocks.Chart;
import pl.zankowski.iextrading4j.api.stocks.Company;
import pl.zankowski.iextrading4j.api.stocks.Logo;
import pl.zankowski.iextrading4j.api.stocks.Quote;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.News;

@MoneyTreeController
@RequestMapping("/stockmarket")
public class StockController {


   private StockMarketDataService stockMarketDataService;

   private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

   @Autowired
   public StockController(StockMarketDataService stockMarketDataService) {
      LOG.info("Initializing StockController");
      this.stockMarketDataService = stockMarketDataService;
   }

   /**
    * Obtain json object containing company quote, info, news, keystats and logo
    *
    * @param symbol symbol of the stock
    * @return batchStocks
    */
   @GetMapping("/batch/{symbol}")
   public ResponseEntity<BatchStocks> getBatchStocksBySymbol(@Valid @PathVariable(name = "symbol") String symbol) {
      BatchStocks batchStocks = stockMarketDataService.getBatchStocksBySymbol(symbol);
      return ResponseEntity.ok(batchStocks);
   }

   @GetMapping("/book/{symbol}")
   public ResponseEntity<Book> getBook(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      Book book = stockMarketDataService.getBook(symbol);
      return ResponseEntity.ok(book);
   }

   @GetMapping("/quote/{symbol}")
   public ResponseEntity<Quote> getQuote(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      Quote quote = stockMarketDataService.getQuote(symbol);
      return ResponseEntity.ok(quote);
   }

   @GetMapping("/company/{symbol}")
   public ResponseEntity<Company> getCompanyInfo(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      Company companyInfo = stockMarketDataService.getCompanyInfo(symbol);
      return ResponseEntity.ok(companyInfo);
   }

   @GetMapping("/news/{symbol}/{n}")
   public ResponseEntity<List<News>> getLastNNews(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol,
                                                  @PathVariable(name = "n") @Valid int n) {
      List<News> news = stockMarketDataService.getLastNNews(symbol, n);
      return ResponseEntity.ok(news);
   }

   @GetMapping("/keystats/{symbol}")
   public ResponseEntity<KeyStats> getKeyStats(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      KeyStats keystats = stockMarketDataService.getKeyStats(symbol);
      return ResponseEntity.ok(keystats);
   }

   @GetMapping("/chart/{symbol}/{range}")
   public ResponseEntity<List<Chart>> getChart(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol, @PathVariable(name = "range") @Valid String range) {
      List<Chart> chart = stockMarketDataService.getChart(symbol, range.toUpperCase());
      return ResponseEntity.ok(chart);
   }

   @GetMapping("/logo/{symbol}")
   public ResponseEntity<Logo> getLogo(@PathVariable(name = "symbol") @Valid @NotBlank @Size(max = 5) String symbol) {
      Logo logo = stockMarketDataService.getLogo(symbol);
      return ResponseEntity.ok(logo);
   }
}
