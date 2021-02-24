package com.capstone.moneytree.controller

import org.springframework.http.HttpStatus

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.BadRequestException
import com.capstone.moneytree.model.node.User

import spock.lang.Specification

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("dev")
class UserControllerIT extends Specification {

   @Autowired
   UserController userController

   @Autowired
   UserDao userDao

   def "a user is correctly persisted then fetched"() {
      setup: "Persist an initial user"
      userDao.save(createUser("test@test9009.com", "raz123412", "pass", "razine1234", "bensari2341", null))

      when: "We fetch the user"
      def persistedUser = userDao.findUserByEmail("test@test9009.com")

      then: "The user has the correct field"
      persistedUser.getEmail() == "test@test9009.com"
      persistedUser.getId() != null

      cleanup:
      userDao.delete(persistedUser)
   }

   def "a user is correctly updated; request body is valid"() {
      setup: "Persist an initial user"
      def persistedUser = userDao.save(createUser("test@test9009.com", "raz123412", "pass", "razine1234", "bensari2341", null))

      and: " a new user from request body"
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User newUser = createUser(newEmail, username, password, firstName, lastName, null)
      newUser.setId(persistedUser.getId())

      when: " we update the user"
      def updatedUser = userController.editUserProfile(persistedUser.getId(), newUser)

      then: " the user should have the updated fields"
      updatedUser.getBody().getEmail() == newEmail
      updatedUser.getBody().getFirstName() == firstName
      updatedUser.getBody().getLastName() == lastName
      updatedUser.getBody().getUsername() == username

      cleanup: "delete the created user"
      userDao.delete(persistedUser)
      userDao.delete(newUser)
   }

   def "the passed user has a different id than the path"() {
      setup: "Persist an initial user"
      def persistedUser = userDao.save(createUser("test@test9092345209.com", "raz23452", "pass2345", "razine2345234", "bensari2345", null))

      and: " a new user from request body"
      String newEmail = "test@test2.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      // by saving a new user, an ID will be autogenerated
      User newUser = userDao.save(createUser(newEmail, username, password, firstName, lastName, null))

      when: " we update the user"
      userController.editUserProfile(persistedUser.getId(), newUser)

      then: " the user should have the updated fields"
      thrown(BadRequestException)

      cleanup: "delete the created user"
      userDao.delete(persistedUser)
      userDao.delete(newUser)
   }

   def "a user can follow another user in the database"() {
      setup: "Persist an initial user and the other user we want to follow"
      def user1 = userDao.save(createUser("test@test.com", "dave", "pass", "Dave", "Bas", "74hgf8734gr-"))

      and: "the other user we want to follow"
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User user2 = userDao.save(createUser(newEmail, username, password, firstName, lastName, "258459fr2w-"))

      when: "following another user"
      def response = userController.followUser(user1.getId(), user2.getId())

      then: "user 1 should be following user 2"
      def updatedUser1 = userDao.findUserByEmail(user1.getEmail())
      updatedUser1.getFollowers().contains(user2)
      updatedUser1.getFollowers().size() == 1
      response.statusCode == HttpStatus.OK
      response.body == user2.getId()

      cleanup: "delete the created users"
      userDao.delete(user1)
      userDao.delete(user2)
   }

   def "a user can unfollow another user in the database"() {
      setup: "Persist an initial user"
      def user1 = userDao.save(createUser("test@test.com", "dave", "pass", "Dave", "Bas", "74hgf8734gr-"))

      and: "persist the other user we want to follow"
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User user2 = createUser(newEmail, username, password, firstName, lastName, "258459fr2w-")
      userDao.save(user2)

      and: "follow it"
      userController.followUser(user1.getId(), user2.getId())

      when: "unfollowing the user"
      def response = userController.unfollowUser(user1.getId(), user2.getId())

      then: "user 1 should unfollow user 2"
      def updatedUser1 = userDao.findUserByEmail(user1.getEmail())
      updatedUser1.getFollowers() == null
      response.statusCode == HttpStatus.OK
      response.body == user2.getId()

      cleanup: "delete the created users"
      userDao.delete(user1)
      userDao.delete(user2)
   }
}