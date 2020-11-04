package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

public interface StockService {

   List<Stock> getAllStocks();

   Stock getStockByLabel(String label);

   Stock getStockByIndustry(String industry);

   Stock getStockByVolatility(String volatility);

   Stock persistStock(Stock stock);

   List<Stock> getStockByUser(User user);

   List<Stock> getStockByTransaction(Transaction transaction);
}
