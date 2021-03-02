package com.capstone.moneytree.controller;

import com.capstone.moneytree.model.SanitizedStock;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.relationship.Owns;
import com.capstone.moneytree.service.api.StockMarketDataService;
import com.capstone.moneytree.service.api.StockService;
import com.capstone.moneytree.service.api.YahooFinanceService;
import com.capstone.moneytree.service.impl.DefaultStockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pl.zankowski.iextrading4j.api.stocks.*;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.News;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@MoneyTreeController
@RequestMapping("/stock")
public class StockController {


    private final StockMarketDataService stockMarketDataService;
    private final YahooFinanceService yahooFinanceService;
    private final StockService stockService;

    private static final Logger LOG = LoggerFactory.getLogger(StockController.class);

    @Autowired
    public StockController(StockMarketDataService stockMarketDataService, YahooFinanceService yahooFinanceService, StockService stockService) {
        this.yahooFinanceService = yahooFinanceService;
        LOG.info("Initializing StockController");
        this.stockMarketDataService = stockMarketDataService;
        this.stockService = stockService;
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

    /*
    Valid ranges: [1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max]
    Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
    */
    @GetMapping(value = "/yahoochart/{symbol}", produces = {"application/json"})
    public Mono<String> getYahooChart(@PathVariable String symbol, @RequestParam String range, @RequestParam String interval) {
        return yahooFinanceService.getHistoricalGraphData(symbol, range, interval);
    }

    /**
     * A GET method that fetches all stocks that a particular user owns
     *
     * @return A proper response with a list of all stocks for that user
     */
    @GetMapping("/owned-stocks/{userId}")
    List<SanitizedStock> getUserStocks(@PathVariable String userId) {
        List<SanitizedStock> userStocks =
                stockService.getUserStocks(Long.parseLong(userId));

        LOG.info("Returning {} transactions", userStocks.size());

        return userStocks;
    }

}
