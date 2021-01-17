package com.capstone.moneytree.controller

import com.capstone.moneytree.exception.BadRequestException
import com.capstone.moneytree.facade.AmazonS3Facade
import com.capstone.moneytree.service.api.UserService
import com.capstone.moneytree.service.impl.DefaultAmazonS3Service
import com.capstone.moneytree.service.impl.DefaultUserService
import com.capstone.moneytree.validator.UserValidator
import com.capstone.moneytree.validator.ValidatorFactory
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

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
   private UserController userController

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

   def "a user is correctly updated; request body is valid"() {
      setup:
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      User userToUpdate = createUser(email, username, password, firstName, lastName, null)
      userDao.save(userToUpdate)

      and: " a new user from request body"
      String newEmail = "test@test2.com"
      User newUser = createUser(newEmail, username, password, firstName, lastName, null)
      newUser.setId(userToUpdate.getId())

      when: " we update the user"
      def updatedUser = userController.editUserProfile(userToUpdate.getId(), newUser)

      then: " the user should have the updated fields"
      updatedUser.getBody().getEmail() == newEmail
      updatedUser.getBody().getFirstName() == firstName
      updatedUser.getBody().getLastName() == lastName
      updatedUser.getBody().getUsername() == username

      cleanup:
      userDao.delete(userToUpdate)
   }

   def "the passed user has a different id than the path"() {
      setup:
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      User userToUpdate = createUser(email, username, password, firstName, lastName, null)
      userDao.save(userToUpdate)

      and: " a new user from request body"
      String newEmail = "test@test2.com"
      User newUser = createUser(newEmail, username, password, firstName, lastName, null)

      when: " we update the user"
      userController.editUserProfile(userToUpdate.getId(), newUser)

      then: " the user should have the updated fields"
      thrown(BadRequestException)

      cleanup:
      userDao.delete(userToUpdate)
   }
}