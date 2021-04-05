package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.MadeDao
import com.capstone.moneytree.dao.StockDao
import com.capstone.moneytree.dao.ToFulfillDao
import com.capstone.moneytree.dao.TransactionDao
import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.facade.AlpacaSession
import com.capstone.moneytree.model.TransactionStatus
import com.capstone.moneytree.model.node.Stock
import com.capstone.moneytree.model.node.Transaction
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.model.relationship.Made
import com.capstone.moneytree.model.relationship.ToFulfill
import net.jacobpeterson.alpaca.AlpacaAPI
import net.jacobpeterson.alpaca.enums.order.OrderSide
import net.jacobpeterson.alpaca.enums.order.OrderTimeInForce
import net.jacobpeterson.domain.alpaca.order.Order
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import spock.lang.Ignore
import spock.lang.Specification

import java.time.ZonedDateTime

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

/**
 * Integration Tests for the Alpaca Controller.
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("dev")
class TransactionControllerIT extends Specification {

    @Autowired
    TransactionController transactionController

    @Autowired
    TransactionDao transactionDao

    @Autowired
    UserDao userDao

    @Autowired
    MadeDao madeDao

    @Autowired
    StockDao stockDao

    @Autowired
    ToFulfillDao toFulfillDao

    AlpacaSession alpacaSession = new AlpacaSession()

    def "Get all transactions in the database"() {
        setup: "Persist some transactions"
        String symbol1 = "AAPL"
        String symbol2 = "TSLA"
        Transaction transaction1 = createTransaction(symbol1, 10, 24, TransactionStatus.PENDING, 1)
        Transaction transaction2 = createTransaction(symbol2, 100, 75, TransactionStatus.COMPLETED, 1)
        transactionDao.save(transaction1)
        transactionDao.save(transaction2)

        when: "We get all transactions"
        List<Transaction> list = transactionController.all()

        then: "Expect to get the transactions"
        list != null
        list.size() == 2
        list.get(0).getSymbol() == symbol1 || symbol2

        cleanup: "Delete persisted transactions"
        transactionDao.delete(transaction1)
        transactionDao.delete(transaction2)
    }

    // TODO: Needs to be fixed in another story
    @Ignore("Needs to be fixed")
    def "Execute a transaction in the database"() {
        setup: "Persist a user and an order"
        String symbol = "TSLA"
        User user = createUser("test@test.com", "user", "pass", "Tester", "Yes", "545e5eee-7ee0-4b17-83db-a8cd95e0570e")
        User persistedUser = userDao.save(user)
        String userId = persistedUser.getId()
        Order order = createOrder("1002333", symbol, "15", "market", "DAY")
        order.setSide("buy")

        and: "mock Alpaca API"
        AlpacaAPI mockedAlpaca = Mock()
        alpacaSession.alpaca(user.getAlpacaApiKey()) >> mockedAlpaca
        mockedAlpaca.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY) >> order

        when: "Execute transaction"
        List<Transaction> response = transactionController.executeTransaction(userId, order)

        then: "The order should be executed with user updated"
        response.get(0).getSymbol() == symbol
        Transaction transaction = transactionDao.findByClientOrderId("1000000")
        ToFulfill toFulfill = toFulfillDao.findByTransactionId(transaction.getId())
        Made made = madeDao.findByTransactionId(transaction.getId())
        Stock stock = stockDao.findBySymbol(order.getSymbol())
        transaction.getSymbol() == symbol
        made.getTransaction() == transaction
        made.getUser() == user
        toFulfill.getTransaction() == transaction

        cleanup:
        toFulfillDao.delete(toFulfill)
        madeDao.delete(made)
        transactionDao.delete(transaction)
        stockDao.delete(stock)
    }

    def "Get user transactions in the database"() {
        setup: "Persist a user and an order"
        User user = createUser("test@test.com", "user", "pass", "User", "Yes", "44y-h4ye")
        User persistedUser = userDao.save(user)
        String symbol1 = "AAPL"
        String symbol2 = "TSLA"
        Transaction transaction1 = createTransaction(symbol1, 100, 24, TransactionStatus.PENDING, 1)
        Transaction transaction2 = createTransaction(symbol2, 110, 4, TransactionStatus.PENDING, 1)
        transactionDao.save(transaction1)
        transactionDao.save(transaction2)
        Made made1 = createMadeRelationship(persistedUser, transaction1, ZonedDateTime.now())
        Made made2 = createMadeRelationship(persistedUser, transaction2, ZonedDateTime.now())
        madeDao.save(made1)
        madeDao.save(made2)

        when: "We execute the transaction"
        List<Transaction> list = transactionController.getUserTransactions(persistedUser.getId().toString())

        then: "Expect to get the transactions"
        list != null
        list.size() == 2
        for (int i = 0; i < list.size(); i++) {
            list.get(i).getSymbol() == symbol1 || symbol2
            list.get(i).getStatus() == TransactionStatus.PENDING
        }

        cleanup: "Delete persisted data"
        madeDao.delete(made1)
        madeDao.delete(made2)
        transactionDao.delete(transaction1)
        transactionDao.delete(transaction2)
        userDao.delete(user)
    }
}
