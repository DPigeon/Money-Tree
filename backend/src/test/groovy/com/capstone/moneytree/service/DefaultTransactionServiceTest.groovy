package com.capstone.moneytree.service

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.buildLimitOrder

import com.capstone.moneytree.dao.MadeDao
import com.capstone.moneytree.dao.ToFulfillDao
import com.capstone.moneytree.dao.StockDao
import com.capstone.moneytree.dao.TransactionDao
import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.AlpacaException
import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.facade.AlpacaSession
import com.capstone.moneytree.model.MoneyTreeOrderType
import com.capstone.moneytree.model.TransactionStatus
import com.capstone.moneytree.model.node.Stock
import com.capstone.moneytree.model.node.Transaction
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.model.relationship.Made
import com.capstone.moneytree.service.api.StockMarketDataService
import com.capstone.moneytree.service.api.TransactionService
import com.capstone.moneytree.service.impl.DefaultTransactionService
import net.jacobpeterson.domain.alpaca.order.Order

import java.time.ZonedDateTime

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.buildMarketOrder
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.buildTransactions
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.buildAsset


import net.jacobpeterson.alpaca.AlpacaAPI
import net.jacobpeterson.alpaca.enums.OrderSide
import net.jacobpeterson.alpaca.enums.OrderTimeInForce
import net.jacobpeterson.domain.alpaca.account.Account
import net.jacobpeterson.domain.alpaca.asset.Asset
import spock.lang.Specification

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createMadeRelationship
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createOrder
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createTransaction
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

/**
 * This class is used to test all basic implementation for the Transaction Service.
 */
class DefaultTransactionServiceTest extends Specification {

    TransactionDao transactionDao = Mock()
    UserDao userDao = Mock()
    StockDao stockDao = Mock();
    MadeDao madeDao = Mock();
    ToFulfillDao toFulfillDao = Mock();
    AlpacaSession session = Mock()
    AlpacaAPI api = Mock()
    StockMarketDataService stockMarketDataService = Mock()
    TransactionService transactionService = new DefaultTransactionService(transactionDao, userDao, stockDao, madeDao, toFulfillDao, session, stockMarketDataService,)

    def "Validate that findAll calls the transactionDao"() {
        when:
        transactionService.getAllTransactions()

        then:
        1 * transactionDao.findAll()
    }

    def "Validate that findTransactionsByOrderType filters correctly"() {
        given: "A list of transaction with different order type"
        transactionDao.findByMoneyTreeOrderType(MoneyTreeOrderType.MARKET_BUY) >> [buildTransactions()[0], buildTransactions()[1], buildTransactions()[2]]

        when: "We get all the market buy type of transactions"
        def marketBuyTransactions = transactionService.getTransactionsByOrderType(MoneyTreeOrderType.MARKET_BUY)


        then: "We should have only 3 MARKET_BUY transactions"
        marketBuyTransactions.size() == 3
        marketBuyTransactions.forEach({
            it.getMoneyTreeOrderType() == MoneyTreeOrderType.MARKET_BUY
        })
    }

    def "Validate the happy path when executing a transaction MARKET_BUY"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildMarketOrder("AAPL", "3","BUY","clientId","market")

        and: "a valid stock"
        Stock newStock = new Stock()
        newStock.setSymbol(order.getSymbol())

        and: "a valid transaction"
        Transaction newTransaction = Transaction.builder().purchasedAt(order.getCreatedAt()).moneyTreeOrderType(MoneyTreeOrderType.MARKET_BUY)
                .clientOrderId(order.getClientOrderId()).status(TransactionStatus.PENDING).quantity(2.00f).symbol("AAPL").build()

        and: "api returns a successful order"
        api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY) >> order
        and: "api return asset for this symbol"
        Asset asset = buildAsset()
        api.getAssetBySymbol(order.getSymbol()) >> asset

        and: "StockDao returns an existing stock object for that symbol"
        stockDao.findBySymbol(order.getSymbol()) >> newStock

        and: "user dao returns a user"
        def user = new User()
        user.setAlpacaApiKey("88999oikkjsga,mbsd")
        Long userId = 1
        user.setId(userId)
        userDao.findUserById(userId) >> user

        and: "returns a balance"
        def balance = "1234.56"
        api.getAccount() >> Stub(Account) {
            getCash() >> balance
        }

        and: "returns the constructed transaction"
        transactionService.constructTransactionFromOrder(order) >> newTransaction

        and: "returns the user transactions "
        List<Made> allMadeRels = new ArrayList<>()
        allMadeRels.add(new Made(user, newTransaction, null))
        madeDao.findByUserId(user.getId()) >> allMadeRels

        and: "returns the user transactions "
        List<Transaction> userTransactionsList = new ArrayList<>()
        userTransactionsList.add(newTransaction)
        transactionService.getUserTransactions(user.getId()) >> userTransactionsList


        when: "execute is triggered"
        transactionService.execute(Long.toString(user.getId()), order)


        then:
        1 * madeDao.save(_)
        1 * toFulfillDao.save(_)
        1 * transactionDao.save(_)
        1 * userDao.save(_)
        assert transactionService.execute(Long.toString(user.getId()), order) == userTransactionsList
    }

    def "Validate the happy path when executing a transaction MARKET_SELL"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildMarketOrder("AAPL", "3","SELL","clientId","market")

        and: "a valid stock"
        Stock newStock = new Stock()
        newStock.setSymbol(order.getSymbol())

        and: "a valid transaction"
        Transaction newTransaction = Transaction.builder()
                .purchasedAt(order.getCreatedAt())
                .moneyTreeOrderType(MoneyTreeOrderType.MARKET_SELL)
                .clientOrderId(order.getClientOrderId())
                .status(TransactionStatus.PENDING)
                .quantity(2.00f).symbol("AAPL").build()

        and: "api returns a successful order"
        api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY) >> order
        and: "api return asset for this symbol"
        Asset asset = buildAsset()
        api.getAssetBySymbol(order.getSymbol()) >> asset

        and: "StockDao returns an existing stock object for that symbol"
        stockDao.findBySymbol(order.getSymbol()) >> newStock

        and: "user dao returns a user"
        def user = new User()
        user.setAlpacaApiKey("88999oikkjsga,mbsd")
        Long userId = 1
        user.setId(userId)
        userDao.findUserById(userId) >> user

        and: "returns a balance"
        def balance = "1234.56"
        api.getAccount() >> Stub(Account) {
            getCash() >> balance
        }

        and: "returns the constructed transaction"
        transactionService.constructTransactionFromOrder(order) >> newTransaction

        and: "returns the user transactions "
        List<Made> allMadeRels = new ArrayList<>()
        allMadeRels.add(new Made(user, newTransaction, null))
        madeDao.findByUserId(user.getId()) >> allMadeRels

        and: "returns the user transactions "
        List<Transaction> userTransactionsList = new ArrayList<>()
        userTransactionsList.add(newTransaction)
        transactionService.getUserTransactions(user.getId()) >> userTransactionsList


        when: "execute is triggered"
        transactionService.execute(Long.toString(user.getId()), order)


        then:
        1 * madeDao.save(_)
        1 * toFulfillDao.save(_)
        1 * transactionDao.save(_)
        1 * userDao.save(_)
        assert transactionService.execute(Long.toString(user.getId()), order) == userTransactionsList
    }

    def "Validate the happy path when executing a transaction LIMIT_BUY"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildLimitOrder("AAPL", "3","BUY","clientId","limit")

        and: "a valid stock"
        Stock newStock = new Stock()
        newStock.setSymbol(order.getSymbol())

        and: "a valid transaction"
        Transaction newTransaction = Transaction.builder()
                .purchasedAt(order.getCreatedAt())
                .moneyTreeOrderType(MoneyTreeOrderType.LIMIT_BUY)
                .clientOrderId(order.getClientOrderId())
                .status(TransactionStatus.PENDING)
                .quantity(2.00f).symbol("AAPL").build()

        and: "api returns a successful order"
        api.requestNewLimitOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY,
                Double.valueOf(order.getLimitPrice()), order.getExtendedHours()) >> order

        and: "api return asset for this symbol"
        Asset asset = buildAsset()
        api.getAssetBySymbol(order.getSymbol()) >> asset

        and: "StockDao returns an existing stock object for that symbol"
        stockDao.findBySymbol(order.getSymbol()) >> newStock

        and: "user dao returns a user"
        def user = new User()
        user.setAlpacaApiKey("88999oikkjsga,mbsd")
        Long userId = 1
        user.setId(userId)
        userDao.findUserById(userId) >> user

        and: "returns a balance"
        def balance = "1234.56"
        api.getAccount() >> Stub(Account) {
            getCash() >> balance
        }

        and: "returns the constructed transaction"
        transactionService.constructTransactionFromOrder(order) >> newTransaction

        and: "returns the user transactions "
        List<Made> allMadeRels = new ArrayList<>()
        allMadeRels.add(new Made(user, newTransaction, null))
        madeDao.findByUserId(user.getId()) >> allMadeRels

        and: "returns the user transactions "
        List<Transaction> userTransactionsList = new ArrayList<>()
        userTransactionsList.add(newTransaction)
        transactionService.getUserTransactions(user.getId()) >> userTransactionsList


        when: "execute is triggered"
        transactionService.execute(Long.toString(user.getId()), order)


        then:
        1 * madeDao.save(_)
        1 * toFulfillDao.save(_)
        1 * transactionDao.save(_)
        1 * userDao.save(_)
        assert transactionService.execute(Long.toString(user.getId()), order) == userTransactionsList
    }

    def "Validate the happy path when executing a transaction LIMIT_SELL"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildLimitOrder("AAPL", "3","SELL","clientId","limit")

        and: "a valid stock"
        Stock newStock = new Stock()
        newStock.setSymbol(order.getSymbol())

        and: "a valid transaction"
        Transaction newTransaction = Transaction.builder()
                .purchasedAt(order.getCreatedAt())
                .moneyTreeOrderType(MoneyTreeOrderType.LIMIT_BUY)
                .clientOrderId(order.getClientOrderId())
                .status(TransactionStatus.PENDING)
                .quantity(2.00f).symbol("AAPL").build()

        and: "api returns a successful order"
        api.requestNewLimitOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY,
                Double.valueOf(order.getLimitPrice()), order.getExtendedHours()) >> order

        and: "api return asset for this symbol"
        Asset asset = buildAsset()
        api.getAssetBySymbol(order.getSymbol()) >> asset

        and: "StockDao returns an existing stock object for that symbol"
        stockDao.findBySymbol(order.getSymbol()) >> newStock

        and: "user dao returns a user"
        def user = new User()
        user.setAlpacaApiKey("88999oikkjsga,mbsd")
        Long userId = 1
        user.setId(userId)
        userDao.findUserById(userId) >> user

        and: "returns a balance"
        def balance = "1234.56"
        api.getAccount() >> Stub(Account) {
            getCash() >> balance
        }

        and: "returns the constructed transaction"
        transactionService.constructTransactionFromOrder(order) >> newTransaction

        and: "returns the user transactions "
        List<Made> allMadeRels = new ArrayList<>()
        allMadeRels.add(new Made(user, newTransaction, null))
        madeDao.findByUserId(user.getId()) >> allMadeRels

        and: "returns the user transactions "
        List<Transaction> userTransactionsList = new ArrayList<>()
        userTransactionsList.add(newTransaction)
        transactionService.getUserTransactions(user.getId()) >> userTransactionsList


        when: "execute is triggered"
        transactionService.execute(Long.toString(user.getId()), order)


        then:
        1 * madeDao.save(_)
        1 * toFulfillDao.save(_)
        1 * transactionDao.save(_)
        1 * userDao.save(_)
        assert transactionService.execute(Long.toString(user.getId()), order) == userTransactionsList
    }

    def "Should throw an exception when the userId does not exist"() {
        given: "Database returns null (no user for that id)"
        userDao.findUserById(123456789) >> null

        when: "executing a transaction for a non existing user"
        transactionService.execute("1234", null)

        then:
        thrown(EntityNotFoundException)
    }

    def "exception thrown by api when making call should be caught"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildMarketOrder()

        and: "user dao returns a user"
        def user = new User()
        userDao.findUserById(_ as Long) >> user

        and: "api request throws exception"
        api.requestNewMarketOrder(_, _, _, _) >> {
            throw new Exception("for test")
        }

        when:
        transactionService.execute("12345678", order)

        then:
        thrown(AlpacaException)
    }

    def "Should update user score properly with positive score"() {
        given: "A user with an order and an old transaction executed"
        String symbol = "TSLA"
        float price1 = 10
        float price2 = 20
        float price3 = 5
        float qty1 = 5
        float qty2 = 3
        float qty3 = 1
        float boughtPrice = 13
        float soldPrice = 40
        double initialScore = 20
        double finalScore = initialScore + soldPrice - boughtPrice
        User user = createUser("test@test.com", "user", "pass", "User", "Name", "key")
        user.setId(10)
        user.setScore(initialScore)
        Order order = createOrder("1", symbol, "10", "market", "DAY");
        order.setSide("sell")
        Transaction transaction1 = createTransaction(symbol, 15, price1, TransactionStatus.COMPLETED, qty1)
        Transaction transaction2 = createTransaction(symbol, 15, price2, TransactionStatus.COMPLETED, qty2)
        Transaction transaction3 = createTransaction(symbol, 15, price3, TransactionStatus.COMPLETED, qty3)
        List<Made> madeList = List.of(
                createMadeRelationship(user, transaction1, ZonedDateTime.now()),
                createMadeRelationship(user, transaction2, ZonedDateTime.now()),
                createMadeRelationship(user, transaction3, ZonedDateTime.now()))
        Transaction currentTransaction = createTransaction(symbol, 15, soldPrice, TransactionStatus.COMPLETED, 1)

        and: "mock database"
        madeDao.findByUserId(user.getId()) >> madeList
        userDao.save(user) >> user

        and: "verify the initial user's score"
        user.getScore() == initialScore

        when: "Updating a user's score"
        transactionService.updateUserScore(order, user, currentTransaction)

        then: "User should have made +27 points"
        user.getScore() == finalScore
    }

    def "Should not update the user's score when prices are equal"() {
        given: "A user with an order and an old transaction executed"
        String symbol = "TSLA"
        float boughtPrice = 25
        float soldPrice = 25
        double initialScore = 100
        double finalScore = 100
        User user = createUser("test@test.com", "user", "pass", "User", "Name", "key")
        user.setId(10)
        user.setScore(initialScore)
        Order order = createOrder("1", symbol, "10", "market", "DAY");
        order.setSide("sell")
        Transaction transaction = createTransaction(symbol, 15, boughtPrice, TransactionStatus.COMPLETED, 1)
        List<Made> madeList = List.of(createMadeRelationship(user, transaction, ZonedDateTime.now()))
        Transaction currentTransaction = createTransaction(symbol, 15, soldPrice, TransactionStatus.COMPLETED, 1)

        and: "mock database"
        madeDao.findByUserId(user.getId()) >> madeList

        and: "verify the initial user's score"
        user.getScore() == initialScore

        when: "Updating a user's score"
        transactionService.updateUserScore(order, user, currentTransaction)

        then: "No updates made to user's score"
        0 * userDao.save(user)
        user.getScore() == initialScore
        user.getScore() == finalScore
    }

    def "Should update user score properly with negative score"() {
        given: "A user with an order and an old transaction executed"
        String symbol = "TSLA"
        float price1 = 10
        float price2 = 20
        float price3 = 5
        float qty1 = 5
        float qty2 = 3
        float qty3 = 1
        float boughtPrice = 13
        float soldPrice = 1
        double initialScore = 10
        double finalScore = initialScore + soldPrice - boughtPrice
        User user = createUser("test@test.com", "user", "pass", "User", "Name", "key")
        user.setId(10)
        user.setScore(initialScore)
        Order order = createOrder("1", symbol, "10", "market", "DAY");
        order.setSide("sell")
        Transaction transaction1 = createTransaction(symbol, 15, price1, TransactionStatus.COMPLETED, qty1)
        Transaction transaction2 = createTransaction(symbol, 15, price2, TransactionStatus.COMPLETED, qty2)
        Transaction transaction3 = createTransaction(symbol, 15, price3, TransactionStatus.COMPLETED, qty3)
        List<Made> madeList = List.of(
                createMadeRelationship(user, transaction1, ZonedDateTime.now()),
                createMadeRelationship(user, transaction2, ZonedDateTime.now()),
                createMadeRelationship(user, transaction3, ZonedDateTime.now()))
        Transaction currentTransaction = createTransaction(symbol, 15, soldPrice, TransactionStatus.COMPLETED, 1)

        and: "mock database"
        madeDao.findByUserId(user.getId()) >> madeList
        userDao.save(user) >> user

        and: "verify the initial user's score"
        user.getScore() == initialScore

        when: "Updating a user's score"
        transactionService.updateUserScore(order, user, currentTransaction)

        then: "User should have made -12 points"
        user.getScore() == finalScore
    }

    def "Should not update user score if not a sell order"() {
        given: "A user buying a stock"
        String symbol = "TSLA"
        User user = createUser("test@test.com", "user", "pass", "User", "Name", "key")
        user.setId(5)
        Order order = createOrder("1", symbol, "10", "market", "DAY");
        order.setSide("buy")
        Transaction currentTransaction = createTransaction(symbol, 15, 15, TransactionStatus.COMPLETED, 1)

        when: "Updating a user's score"
        transactionService.updateUserScore(order, user, currentTransaction)

        then: "Database should not be called"
        0 * madeDao.findByUserId(user.getId())
    }

    def "Should throw exception when transaction is not found"() {
        given: "A user with an order and an old transaction executed"
        String symbol1 = "TSLA"
        String symbol2 = "AAPL"
        float boughtPrice = 10
        float soldPrice = 40
        double initialScore = 10
        User user = createUser("test@test.com", "user", "pass", "User", "Name", "key")
        user.setId(10)
        user.setScore(initialScore)
        Order order = createOrder("1", symbol1, "10", "market", "DAY");
        order.setSide("sell")
        Transaction transaction = createTransaction(symbol1, 15, boughtPrice, TransactionStatus.COMPLETED, 1)
        List<Made> madeList = List.of(createMadeRelationship(user, transaction, ZonedDateTime.now()))
        Transaction currentTransaction = createTransaction(symbol2, 15, soldPrice, TransactionStatus.COMPLETED, 1)

        and: "mock database"
        madeDao.findByUserId(user.getId()) >> madeList
        userDao.save(user) >> user

        and: "verify the initial user's score"
        user.getScore() == initialScore

        when: "Updating a user's score"
        transactionService.updateUserScore(order, user, currentTransaction)

        then: "Transaction not found exception thrown"
        thrown(EntityNotFoundException)
    }

    Stock buildStock(Asset asset) {
        return Stock.builder()
                .status(asset.getStatus())
                .symbol(asset.getSymbol())
                .exchange(asset.getExchange())
                .build()
    }
}