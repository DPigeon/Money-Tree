package com.capstone.moneytree.controller

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.model.node.User

import spock.lang.Specification

@SpringBootTest
@ActiveProfiles("dev")
class UserControllerIT extends Specification {

   @Autowired
   private UserDao userDao

   def "sample test integration user test"() {
      given: " a user to persist"
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      User user = createUser(email, username, password, firstName, lastName, null)

      when: "I persist the user"
      def userdb = userDao.save(user)

      then:
      userdb.getEmail() == email

      cleanup:
      userDao.delete(userdb)
   }
}