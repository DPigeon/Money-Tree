package com.capstone.moneytree.service.api;

import java.util.List;

import com.capstone.moneytree.model.SanitizedStock;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.relationship.Owns;

public interface StockService {

    List<Stock> getAllStocks();

    List<SanitizedStock> getUserStocks(Long userId);

}
