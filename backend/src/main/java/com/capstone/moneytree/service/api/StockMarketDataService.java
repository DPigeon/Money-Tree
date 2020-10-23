package com.capstone.moneytree.service.api;

import org.springframework.beans.factory.annotation.Autowired;
import pl.zankowski.iextrading4j.api.stocks.Quote;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;

import java.util.List;

public interface StockMarketDataService {

    Quote getQuoteBySymbol(String symbol);
    BatchStocks getBatchStocksBySymbols(String symbols);
}
