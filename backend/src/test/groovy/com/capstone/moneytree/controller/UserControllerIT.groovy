package com.capstone.moneytree.controller

import org.junit.Test
import org.springframework.http.HttpStatus

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

   @Test
   def "a search request is made to retrieve only the essential properties of a User"() {
      setup: "Persist an initial set of users"
      userDao.save(createUser("test@test909234sd202.com", "raz23452", "pass2345", "razine2345234", "bensari2345", null))
      userDao.save(createUser("test@test2156ds587482.com", "raz54612", "pass1235", "razine8453123", "bensari2315", null))
      List<User> persistedUsers = new ArrayList<User>()
      persistedUsers.push(userDao.findUserByEmail("test@test909234sd202.com"))
      persistedUsers.push(userDao.findUserByEmail("test@test2156ds587482.com"))

      when: "we obtain the search users"
      def searchUsers = userDao.getSearchUsers()

      then: "each persisted user should be return represented with only the essential fields for the search list"
      for (Map<String, String> user:searchUsers) {
         for (User persistedUser:persistedUsers) {
            if (user.get("id") == Long.toString(persistedUser.getId())) {
               assert user.get("id") == Long.toString(persistedUser.getId())
               assert user.get("firstName") == persistedUser.getFirstName()
               assert user.get("lastName") == persistedUser.getLastName()
               assert user.get("email") == persistedUser.getEmail()
               assert user.get("username") == persistedUser.getUsername()
               assert user.get("avatarURL") == persistedUser.getAvatarURL()
               assert user.get("alpacaApiKey") == null
               assert user.get("balance") == null
               assert user.get("score") == null
               assert user.get("rank") == null
               assert user.get("password") == null
            }
         }
      }

      cleanup: "delete the created user"
      for (User persistedUser:persistedUsers)
         userDao.deleteAll()
   }
  
   def "a user can follow another user in the database"() {
      setup: "Persist an initial user"
      userDao.save(createUser(12345678,"test@test.com", "dave", "pass", "Dave", "Bas", "74hgf8734gr-"))
      def user1 = userDao.findUserById(12345678)

      and: "the other user we want to follow"
      Long id = 12345679
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User user2 = createUser(id, newEmail, username, password, firstName, lastName, "258459fr2w-")
      userDao.save(user2)

      when: "following another user"
      def response = userController.followUser(user1.getId(), user2.getId())

      then: "user 1 should be following user 2"
      assert user1.getFollowers().contains(user2)
      assert user1.getFollowers().size() == 1
      assert response.statusCode == HttpStatus.OK
      assert response.body == user2.getId()

      cleanup: "delete the created users"
      userDao.delete(user1)
      userDao.delete(user2)
   }

   def "a user can unfollow another user in the database"() {
      setup: "Persist an initial user"
      userDao.save(createUser(12345678,"test@test.com", "dave", "pass", "Dave", "Bas", "74hgf8734gr-"))
      def user1 = userDao.findUserById(12345678)

      and: "persist the other user we want to follow & follow it"
      Long id = 12345679
      String newEmail = "test@test2123.com"
      String username = "razine123"
      String password = "encrypted"
      String firstName = "razineFristName"
      String lastName = "BENSARI-razine"
      User user2 = createUser(id, newEmail, username, password, firstName, lastName, "258459fr2w-")
      userDao.save(user2)
      userController.followUser(user1.getId(), user2.getId())

      when: "unfollowing the user"
      def response = userController.unfollowUser(user1.getId(), user2.getId())

      then: "user 1 should unfollow user 2"
      assert user1.getFollowers().isEmpty()
      assert response.statusCode == HttpStatus.OK
      assert response.body == user2.getId()

      cleanup: "delete the created users"
      userDao.delete(user1)
      userDao.delete(user2)
   }
}