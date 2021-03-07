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
              .avatarURL("https://moneytree-profile-pictures.s3.amazonaws.com/DEFAULT-profile.jpg")
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
   static buildMarketOrder(String symbol = "AAPL", String qty = "3", String side = "BUY", String clientOrderId = "clientId", String type = "market") {
      def order = new Order()
      order.setSymbol(symbol)
      order.setQty(qty)
      order.setSide(side)
      order.setClientOrderId(clientOrderId)
      order.setTimeInForce(OrderTimeInForce.DAY as String)
      order.setCreatedAt(ZonedDateTime.now())
      order.setSubmittedAt(ZonedDateTime.now())
      order.setType(type)
      return order
   }

   /**
    * Utility method to build an asset
    */
   static buildAsset(String symbol = "AAPL", String exchange = "NASDAQ", String status = "active") {
      def asset = new Asset()
      asset.setSymbol(symbol)
      asset.setExchange(exchange)
      asset.setStatus(status)
      return asset
   }

   static TradeUpdate createTradeUpdate(String id, String clientId, String symbol, String qty, String filledQty, String type, String limitPrice, String avgPrice, String event, String price, ZonedDateTime timestamp, String position) {
      Order order = new Order(id, clientId, null, null, null, null, null, null, null, null, null, null, null, symbol, null, qty, filledQty, type, null, null, limitPrice, null, avgPrice, null, null, null, null, null, null)
      return new TradeUpdate(event, price, timestamp, position, order)
   }
}