package com.capstone.moneytree.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.capstone.moneytree.model.SanitizedStock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.StockDao;
import com.capstone.moneytree.dao.RelationshipDao.OwnsDao;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.SanitizedStock;
import com.capstone.moneytree.model.relationship.Owns;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.StockService;

@Service
@Transactional
public class DefaultStockService implements StockService {

    private final StockDao stockDao;
    private final OwnsDao ownsDao;
    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultStockService.class);

    @Autowired
    public DefaultStockService(StockDao stockDao, OwnsDao ownsDao) {
        this.stockDao = stockDao;
        this.ownsDao = ownsDao;
    }

    @Override
    public List<Stock> getAllStocks() {
        LOGGER.info("Getting all stocks...");
        return stockDao.findAll();
    }

    @Override
    public List<SanitizedStock> getUserStocks(Long userId) {
        List<SanitizedStock> userStocks = new ArrayList<>();
        List<Owns> allOwnsRels = ownsDao.findByUserId(userId);
        for (Owns rel : allOwnsRels) {
            userStocks.add(new SanitizedStock(rel));
        }
        return userStocks;
    }

}
