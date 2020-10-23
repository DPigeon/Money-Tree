package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.facade.StockMarketDataFacade;
import com.capstone.moneytree.service.api.StockMarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.zankowski.iextrading4j.api.stocks.Quote;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;

import java.util.List;

@Service
@Transactional
public class DefaultStockMarketDataService implements StockMarketDataService {

    @Autowired
    StockMarketDataFacade stockMarketDataFacade;

    @Override
    public Quote getQuoteBySymbol(String symbol) {
        return stockMarketDataFacade.getQuote(symbol);
    }

    @Override
    public BatchStocks getBatchStocksBySymbols(String symbols) {
        return stockMarketDataFacade.getBatchStocksBySymbols(symbols);
    }
}
