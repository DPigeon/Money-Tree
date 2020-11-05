package com.capstone.moneytree.service.api;

import pl.zankowski.iextrading4j.api.stocks.*;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.News;

import java.util.List;

public interface StockMarketDataService {

    BatchStocks getBatchStocksBySymbol(String symbols);
    Book getBook(String symbol);
    Quote getQuote(String symbol);
    Company getCompanyInfo(String symbol);
    List<News> getLastNNews(String symbol, int lastN);
    KeyStats getKeyStats(String symbol);
    List<Chart> getChart(String symbol, String range);
    Logo getLogo(String symbol);
}
