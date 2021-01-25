package com.capstone.moneytree.utils

import com.capstone.moneytree.model.node.User

class MoneyTreeTestUtils {

   /**
    * Utility method to create a user
    */
   static User createUser(Long id = new Random().nextLong(), String email, String username, String password, String firstName, String lastName, String alpacaApiKey) {
      User user = User.builder()
              .email(email)
              .username(username)
              .password(password)
              .firstName(firstName)
              .lastName(lastName)
              .alpacaApiKey(alpacaApiKey)
              .build()
      user.setId(id)
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
}