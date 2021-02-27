package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

public interface StockService {

    List<Stock> getAllStocks();

    List<Stock> getUserStocks(Long userId);

}
