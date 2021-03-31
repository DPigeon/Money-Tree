package com.capstone.moneytree.service.api;

import java.util.HashMap;
import java.util.List;

import com.capstone.moneytree.model.SanitizedStock;
import com.capstone.moneytree.model.node.Stock;


public interface StockService {

    List<Stock> getAllStocks();

    List<SanitizedStock> getUserStocks(Long userId);


    HashMap<String, Long> getPeopleWhoOwnAlsoOwn(String symbol);

    Stock getStockBySymbol(String symbol);

}
