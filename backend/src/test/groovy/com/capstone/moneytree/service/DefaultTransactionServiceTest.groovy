package com.capstone.moneytree.service

import com.capstone.moneytree.dao.RelationshipDao.MadeDao
import com.capstone.moneytree.dao.RelationshipDao.ToFulfillDao
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

    def "Validate the happy path when executing a transaction"() {
        given: "The session returns the mock api"
        session.alpaca(_) >> api

        and: "a valid order"
        def order = buildMarketOrder()

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

    Stock buildStock(Asset asset) {
        return Stock.builder()
                .status(asset.getStatus())
                .symbol(asset.getSymbol())
                .exchange(asset.getExchange())
                .build()
    }
}