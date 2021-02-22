package com.capstone.moneytree.utils

import com.capstone.moneytree.model.node.User
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
      user.setId(new Random().nextLong())
      return user
   }

   /**
    * Utility method to create a user
    */
   static User createUser(Long id, String email, String username, String password, String firstName, String lastName, String alpacaApiKey) {
      User user = User.builder()
              .email(email)
              .username(username)
              .password(password)
              .firstName(firstName)
              .lastName(lastName)
              .alpacaApiKey(alpacaApiKey)
              .build();
      user.setId(id);
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

   static TradeUpdate createTradeUpdate(String id, String clientId, String symbol, String qty, String filledQty, String type, String limitPrice, String avgPrice, String event, String price, ZonedDateTime timestamp, String position) {
      Order order = new Order(id, clientId, null, null, null, null, null, null, null, null, null, null, null, symbol, null, qty, filledQty, type, null, null, limitPrice, null, avgPrice, null, null, null, null, null, null)
      return new TradeUpdate(event, price, timestamp, position, order)
   }
}