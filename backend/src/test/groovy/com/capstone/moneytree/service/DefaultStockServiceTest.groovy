package com.capstone.moneytree.service

import com.capstone.moneytree.dao.OwnsDao
import com.capstone.moneytree.dao.StockDao
import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.model.SanitizedStock
import com.capstone.moneytree.model.node.Stock
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.model.relationship.Owns
import com.capstone.moneytree.service.api.StockService
import com.capstone.moneytree.service.impl.DefaultStockService
import com.capstone.moneytree.utils.MoneyTreeTestUtils

import spock.lang.Ignore
import spock.lang.Specification

/**
 * This class is used to test all basic implementation for the Stock Service.
 */
class DefaultStockServiceTest extends Specification {

    StockDao stockDao
    OwnsDao ownsDao
    StockService stockService

    def setup() {
        stockDao = Mock()
        ownsDao = Mock()
        stockService = new DefaultStockService(stockDao, ownsDao)
    }

    def "Should get all stocks by calling the database once"() {
        given: "mocked database"
        List<Stock> stockList = List.of(
                new Stock("AAPL", "Apple"),
                new Stock("TSLA", "Tesla")
        )
        stockDao.findAll() >> stockList

        when: "getting all stocks"
        List<Stock> stocks = stockService.getAllStocks()

        then: "should get all stocks"
        stocks != null
        stocks.size() == 2
        stockList == stocks
    }

    def "Should get all user stocks"() {
        given: "the necessary info and a mocked database"
        User user = MoneyTreeTestUtils.createUser("test@test.com", "user", "pass", "User", "Name", "2a33-a242")
        Stock stock = new Stock("AAPL", "Apple")
        Long userId = 1
        List<Owns> ownsList = List.of(
                new Owns(user, stock, new Date(), 10.0, 20.0, 30.0)
        )
        ownsDao.findByUserId(userId) >> ownsList

        when:
        List<SanitizedStock> owns = stockService.getUserStocks(userId)

        then: "should get all user stocks"
        owns != null
        owns.size() == 1
    }

    def "Should get that stock using the symbol"() {
        given: "a stock"
        Stock stock0 = new Stock("AAPL", "Apple")

        and:
        stockDao.findBySymbol("AAPL") >> stock0

        when:
        Stock stock1 = stockService.getStockBySymbol("AAPL")

        then:
        stock1 == stock0
    }

    def "Should thrown entity not found exception if find by symbol returns null"() {
        given:
        stockDao.findBySymbol("aapl") >> null

        when:
        stockService.getStockBySymbol("aapl")

        then:
        def e = thrown(EntityNotFoundException)
        e.getMessage() == "The requested stock was not found"
    }
}
