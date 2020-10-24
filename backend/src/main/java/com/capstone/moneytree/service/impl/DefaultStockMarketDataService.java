package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.facade.StockMarketDataFacade;
import com.capstone.moneytree.service.api.StockMarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.zankowski.iextrading4j.api.stocks.*;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.News;

import java.util.List;

@Service
@Transactional
public class DefaultStockMarketDataService implements StockMarketDataService {

    @Autowired
    StockMarketDataFacade stockMarketDataFacade;

    @Override
    public BatchStocks getBatchStocksBySymbol(String symbol) {
        return stockMarketDataFacade.getBatchStocksBySymbol(symbol);
    }

    @Override
    public Book getBook(String symbol) {
        return stockMarketDataFacade.getBook(symbol);
    }

    @Override
    public Quote getQuote(String symbol) {
        return stockMarketDataFacade.getQuote(symbol);
    }

    @Override
    public Company getCompanyInfo(String symbol) {
        return stockMarketDataFacade.getCompanyInfo(symbol);
    }

    @Override
    public List<News> getLastNNews(String symbol, int lastN) {
        return stockMarketDataFacade.getLastNNews(symbol, lastN);
    }

    @Override
    public KeyStats getKeyStats(String symbol) {
        return stockMarketDataFacade.getKeyStats(symbol);
    }

    @Override
    public List<Chart> getChart(String symbol, String range) {
        return stockMarketDataFacade.getChart(symbol, range);
    }

    @Override
    public Logo getLogo(String symbol) {
        return stockMarketDataFacade.getLogo(symbol);
    }
}
