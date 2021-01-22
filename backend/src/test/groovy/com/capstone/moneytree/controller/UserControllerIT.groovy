package com.capstone.moneytree.controller

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

import org.junit.Rule
import org.neo4j.harness.junit.rule.Neo4jRule
import org.neo4j.ogm.config.Configuration
import org.neo4j.ogm.session.Session
import org.neo4j.ogm.session.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.BadRequestException
import com.capstone.moneytree.model.node.User

import spock.lang.Ignore
import spock.lang.Specification

@Ignore
@SpringBootTest
@ActiveProfiles("dev")
class UserControllerIT extends Specification {

   @Autowired
   private UserController userController

   @Autowired
   UserDao userDao

   @Rule
   public Neo4jRule neoServer = new Neo4jRule()

   private Session session

   def setup() {
      Configuration configuration = new Configuration.Builder()
              .uri(neoServer.boltURI().toString())
              .build()

      SessionFactory sessionFactory = new SessionFactory(configuration, User.class.getPackage().getName());
      session = sessionFactory.openSession();
      session.purgeDatabase()
   }

   def "a user is correctly updated; request body is valid"() {
      setup: "Persist an initial user"
      userDao.save(createUser("test@test9009.com", "raz123412", "pass", "razine1234", "bensari2341", null))
      def persistedUser = userDao.findUserByEmail("test@test9009.com")

      and: " a new user from request body"
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User newUser = createUser(persistedUser.getId(), newEmail, username, password, firstName, lastName, null)

      when: " we update the user"
      def updatedUser = userController.editUserProfile(persistedUser.getId(), newUser)

      then: " the user should have the updated fields"
      updatedUser.getBody().getEmail() == newEmail
      updatedUser.getBody().getFirstName() == firstName
      updatedUser.getBody().getLastName() == lastName
      updatedUser.getBody().getUsername() == username

      cleanup: "delete the created user"
      userDao.delete(persistedUser)
   }

   def "the passed user has a different id than the path"() {
      setup: "Persist an initial user"
      userDao.save(createUser("test@test9092345209.com", "raz23452", "pass2345", "razine2345234", "bensari2345", null))
      def persistedUser = userDao.findUserByEmail("test@test9092345209.com")

      and: " a new user from request body"
      String newEmail = "test@test2.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      Long differentId = 123
      User newUser = createUser(differentId, newEmail, username, password, firstName, lastName, null)

      when: " we update the user"
      userController.editUserProfile(persistedUser.getId(), newUser)

      then: " the user should have the updated fields"
      thrown(BadRequestException)

      cleanup: "delete the created user"
      userDao.delete(persistedUser)
   }
}