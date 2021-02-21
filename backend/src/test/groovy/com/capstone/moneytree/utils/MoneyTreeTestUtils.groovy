package com.capstone.moneytree.utils

import com.capstone.moneytree.model.MoneyTreeOrderType
import com.capstone.moneytree.model.node.Transaction
import com.capstone.moneytree.model.node.User

import net.jacobpeterson.alpaca.enums.OrderTimeInForce
import net.jacobpeterson.domain.alpaca.asset.Asset
import net.jacobpeterson.domain.alpaca.order.Order
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate

import java.time.ZonedDateTime

class MoneyTreeTestUtils {

   /**
    * Utility method to create a user with random ID
    */
   static User createUser(String email, String username, String password, String firstName, String lastName, String alpacaApiKey) {
      User user = User.builder()
              .email(email)
              .username(username)
              .password(password)
              .firstName(firstName)
              .lastName(lastName)
              .alpacaApiKey(alpacaApiKey)
              .build()
      return user
   }

   /**
    * Utility method to create a list of 3 users
    */
   static List<User> createUsersInMockedDatabase() {
      User user1 = createUser("yuu@test.com", "yury1", "hello1", "Yury", "Krystler", null)
      User user2 = createUser("cath@test.com", "Cath", "hello2", "Catherine", "Kole", null)
      User user3 = createUser("joe@test.com", "Joe", "hello3", "Joe", "Wert", null)
      return Arrays.asList(user1, user2, user3)
   }

   /**
    * Utility method to create credentials and return a user
    * */
   static User createCredential(String email, String password) {
      return User.builder()
              .email(email)
              .password(password)
              .build()
   }

   /**
    * Utility method to create transactions
    */
   static List<Transaction> buildTransactions() {
      return [
         Transaction.builder().moneyTreeOrderType(MoneyTreeOrderType.MARKET_BUY).build(),
         Transaction.builder().moneyTreeOrderType(MoneyTreeOrderType.MARKET_BUY).build(),
         Transaction.builder().moneyTreeOrderType(MoneyTreeOrderType.MARKET_BUY).build(),
         Transaction.builder().moneyTreeOrderType(MoneyTreeOrderType.MARKET_SELL).build(),
         Transaction.builder().moneyTreeOrderType(MoneyTreeOrderType.LIMIT_BUY).build()
      ]

   }

   /**
    * Utility method to build an order
    */
   static buildMarketOrder() {
      def order = new Order()
      order.setSymbol("AAPL")
      order.setQty("3")
      order.setSide("BUY")
      order.setClientOrderId("clientId")
      order.setTimeInForce(OrderTimeInForce.DAY as String)
      order.setCreatedAt(ZonedDateTime.now())
      order.setSubmittedAt(ZonedDateTime.now())
      order.setType("Market")
      return order
   }

   /**
    * Utility method to build an asset
    */
   static buildAsset() {
      def asset = new Asset()
      asset.setSymbol("AAPL")
      asset.setExchange("NASDAQ")
      asset.setStatus("active")
      return asset
   }

   static TradeUpdate createTradeUpdate(String id, String clientId, String symbol, String qty, String filledQty, String type, String limitPrice, String avgPrice, String event, String price, ZonedDateTime timestamp, String position) {
      Order order = new Order(id, clientId, null, null, null, null, null, null, null, null, null, null, null, symbol, null, qty, filledQty, type, null, null, limitPrice, null, avgPrice, null, null, null, null, null, null)
      return new TradeUpdate(event, price, timestamp, position, order)
   }
}