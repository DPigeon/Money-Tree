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
                new Stock("AAPL", "Apple", "Technology"),
                new Stock("TSLA", "Tesla", "Cars")
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
        Stock stock = new Stock("AAPL", "Apple", "Technology")
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
        Stock stock0 = new Stock("AAPL", "Apple", "Technology")

        and:
        stockDao.findBySymbol("AAPL") >> stock0

        when:
        Stock stock1 = stockService.getStockBySymbol("AAPL")

        then:
        stock1 == stock0
    }

    def "Should get all ratios for 'people who own this stock also own'"() {
        given: "3 users"
        User userA = MoneyTreeTestUtils.createUser("testA@test.com", "userA", "pass", "UserA", "NameA", "2a33-a242-A")
        User userB = MoneyTreeTestUtils.createUser("testB@test.com", "userB", "pass", "UserB", "NameB", "2a33-a242-B")
        User userC = MoneyTreeTestUtils.createUser("testC@test.com", "userC", "pass", "UserC", "NameC", "2a33-a242-C")

        userA.setId(1)
        userB.setId(2)
        userC.setId(3)

        and: "3 stocks"
        Stock stock1 = new Stock("AAPL", "Apple", "Technology")
        Stock stock2 = new Stock("TSLA", "Tesla", "Cars")
        Stock stock3 = new Stock("GOOG", "Google", "Technology")

        and: "userA, userB and userC own Apple"
        Owns ownsApple1 = new Owns(userA, stock1, new Date(), 1, 1, 1)
        Owns ownsApple2 = new Owns(userB, stock1, new Date(), 1, 1, 1)
        Owns ownsApple3 = new Owns(userC, stock1, new Date(), 1, 1, 1)

        and: "userA and userB own Tesla"
        Owns ownsTesla1 = new Owns(userA, stock2, new Date(), 1, 1, 1)
        Owns ownsTesla2 = new Owns(userB, stock2, new Date(), 1, 1, 1)

        and: "userC own Google"
        Owns ownsGoogle3 = new Owns(userC, stock3, new Date(), 1, 1, 1)

        and: "mocking findByStockSymbol using AAPL should return all 3 relationships"
        ownsDao.findByStockSymbol("AAPL") >> [ownsApple1, ownsApple2, ownsApple3]

        and: "mocking findByUserId for each user should return the owns relationship"
        ownsDao.findByUserId(1) >> [ownsApple1, ownsTesla1]
        ownsDao.findByUserId(2) >> [ownsApple2, ownsTesla2]
        ownsDao.findByUserId(3) >> [ownsApple3, ownsGoogle3]

        when:
        HashMap<String, Long> stockMap = stockService.getPeopleWhoOwnAlsoOwn("AAPL")

        then: "should get ratio for each stock"
        assert stockMap != null
        assert stockMap.size() == 2
        assert !stockMap.containsKey("APPL")
        assert stockMap.get("TSLA") == 66
        assert stockMap.get("GOOG") == 33
    }
}
