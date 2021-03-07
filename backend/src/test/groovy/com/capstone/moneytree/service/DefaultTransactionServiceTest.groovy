package com.capstone.moneytree.service

import com.capstone.moneytree.dao.TransactionDao
import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.AlpacaException
import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.facade.AlpacaSession
import com.capstone.moneytree.model.MoneyTreeOrderType
import com.capstone.moneytree.model.TransactionStatus
import com.capstone.moneytree.model.node.Stock
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.api.TransactionService
import com.capstone.moneytree.service.impl.DefaultTransactionService

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
   AlpacaSession session = Mock()
   AlpacaAPI api = Mock()
   TransactionService transactionService = new DefaultTransactionService(transactionDao, userDao, session)

   def "Validate that findAll calls the transactionDao"() {
      when:
      transactionService.getAllTransactions()

      then:
      1 * transactionDao.findAll()
   }

   def "Validate that findTransactionsByOrderType filters correctly"() {
      given: "A list of transaction with different order type"
      transactionDao.findAll() >> buildTransactions()

      when: "We get all the market buy type of transactions"
      def marketBuyTransactions = transactionService.getTransactionsByOrderType(MoneyTreeOrderType.MARKET_BUY)

      then: "We should have only 3 transactions"
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

      and: "api returns a successful order"
      api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY) >> order

      and: "api return asset for this symbol"
      Asset asset = buildAsset()
      api.getAssetBySymbol(order.getSymbol()) >> asset

      and: "user dao returns a user"
      def user = new User()
      userDao.findUserById(_ as Long) >> user

      and: "returns a balance"
      def balance = "1234.56"
      api.getAccount() >> Stub(Account) {
         getCash() >> balance
      }

      when: "execute is triggered"
      transactionService.execute("123456789", order)

      then:
      1 * userDao.save(_)
      user.getTransactions().size() == 1
      user.getBalance() == Float.parseFloat(balance)
      user.getTransactions()[0].with {
         it.getStatus() == TransactionStatus.PENDING
         it.getMoneyTreeOrderType() == MoneyTreeOrderType.MARKET_BUY
      }
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