package com.capstone.moneytree.service.impl;

import static com.capstone.moneytree.handler.ExceptionMessage.STOCK_NOT_FOUND;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.model.SanitizedStock;
import com.capstone.moneytree.model.node.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.StockDao;
import com.capstone.moneytree.dao.OwnsDao;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.relationship.Owns;
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

    @Override
    public HashMap<String, Long> getPeopleWhoOwnAlsoOwn(String symbol) {
        List<Owns> all = ownsDao.findByStockSymbol(symbol);
        List<User> usersWhoOwnStock = new ArrayList<>();

        //fetch all users who own stock specified in request
        for (Owns own:all) {
            usersWhoOwnStock.add(own.getUser());
        }

        HashMap<String, Long> stockMap = new HashMap<>();

        //for each user who owns the requested symbol, fetch all the stocks it owns
        for (User user:usersWhoOwnStock) {
            List<Owns> ownsList = ownsDao.findByUserId(user.getId());

            HashMap<String, Boolean> existsForUser = new HashMap<>();

            for (Owns own:ownsList) {
                String s = own.getStock().getSymbol();
                //must not be the stock in the request
                if (!s.equals(symbol)) {
                    //since user can own a single stock multiple time, ensure that each stock is only considered once
                    if (existsForUser.containsKey(s)) {
                        continue;
                    }
                    else {
                        existsForUser.put(s, true);
                    }
                    //add stock to stockMap
                    if (stockMap.containsKey(s)) {
                        stockMap.replace(s, stockMap.get(s) + 1);
                    }
                    else {
                        stockMap.put(s, Long.parseLong("1"));
                    }
                }
            }
        }

        for (Map.Entry<String, Long> entry :stockMap.entrySet()) {
            stockMap.replace(entry.getKey(), entry.getValue()*100/usersWhoOwnStock.size());
        }

        return stockMap;
    }
  
  @Override  
  public Stock getStockBySymbol(String symbol) {
        Stock stock = stockDao.findBySymbol(symbol);
        if (stock == null) {
            throw new EntityNotFoundException(STOCK_NOT_FOUND.getMessage());
        }
        return stock;
    }
}
