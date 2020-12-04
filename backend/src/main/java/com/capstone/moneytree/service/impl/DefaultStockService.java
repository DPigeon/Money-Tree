package com.capstone.moneytree.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.StockDao;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.StockService;

@Service
@Transactional
public class DefaultStockService implements StockService {

   private final StockDao stockDao;
   private static final Logger LOGGER = LoggerFactory.getLogger(DefaultStockService.class);

   @Autowired
   public DefaultStockService(StockDao stockDao) {
      this.stockDao = stockDao;
   }

   @Override
   public List<Stock> getAllStocks() {
      LOGGER.info("Getting all stocks...");
      return stockDao.findAll();
   }

   @Override
   public Stock getStockByLabel(String label) {
      return null;
   }

   @Override
   public Stock getStockByIndustry(String industry) {
      return null;
   }

   @Override
   public Stock getStockByVolatility(String volatility) {
      return null;
   }

   @Override
   public Stock persistStock(Stock stock) {
      return null;
   }

   @Override
   public List<Stock> getStockByUser(User user) {
      return null;
   }

   @Override
   public List<Stock> getStockByTransaction(Transaction transaction) {
      return null;
   }
}
