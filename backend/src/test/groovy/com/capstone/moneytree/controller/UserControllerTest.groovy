package com.capstone.moneytree.controller

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUsersInMockedDatabase

import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.exception.MissingMandatoryFieldException
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.api.UserService
import com.capstone.moneytree.service.impl.DefaultUserService
import com.capstone.moneytree.validator.UserValidator
import com.capstone.moneytree.validator.ValidatorFactory
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Specification

import javax.security.auth.login.CredentialNotFoundException;

/**
 * Unit Tests for the User Controller.
 */
@SpringBootTest
class UserControllerTest extends Specification {

   private static final String URL_LOCATION = "http://localhost/users/"

   private static UserDao userDao
   private static UserValidator userValidator
   private static ValidatorFactory validatorFactory
   private static UserService defaultUserService
   private static UserController userController

   def setup() {
      userDao = Mock()
      userValidator = new UserValidator(userDao)
      validatorFactory = Mock(ValidatorFactory) {
         it.getUserValidator() >> userValidator
      }
      defaultUserService = new DefaultUserService(userDao, validatorFactory)
      userController = new UserController(defaultUserService)
      MockHttpServletRequest request = new MockHttpServletRequest()
      RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request))
   }

   @Test
   def "Should register a user successfully"() {
      given: "a user from user fields and another mocked user"
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      User user = createUser(email, username, password, firstName, lastName, null)

      and: "mock the database with some users already registered"
      userDao.findAll() >> createUsersInMockedDatabase()
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> null

      and: "mock the database to save the user"
      userDao.save(user) >> user

      when: "creating a user"
      def response = userController.createUser(user)

      then: "should create a user"
      response.statusCode == HttpStatus.CREATED
      response.getHeaders().getLocation().toString() == new URI(URL_LOCATION.concat(user.getId() as String)).toString()

   }

   @Test
   def "Should not register a user with any empty fields"() {
      given: "a user with empty fields"
      String email = ""
      String username = "Test"
      String password = "encrypted"
      String firstName = ""
      String lastName = "Doe"
      User user = createUser(email, username, password, firstName, lastName, null)

      when: "creating a user"
      userController.createUser(user)

      then: "should throw MissingMandatoryFieldException"
      thrown(MissingMandatoryFieldException)
   }

   @Test
   def "Should not register a user if email already exists"() {
      given: "a user with email already registered"
      String email = "cath@test.com"
      String username = "Kathe"
      String password = "encrypted"
      String firstName = "Katherine"
      String lastName = "Jill"
      User user = createUser(email, username, password, firstName, lastName, null)

      and: "mock the database with some users already registered"
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> user

      when: "creating a user"
      userController.createUser(user)

      then: "should throw UserAlreadyExistsException"
      thrown(UserAlreadyExistsException)
   }

   @Test
   def "Should not register a user if username already exists"() {
      given: "a user with username already registered"
      String email = "moneytree@test.com"
      String username = "Cath"
      String password = "encrypted"
      String firstName = "Caterine"
      String lastName = "Hoyes"
      User user = createUser(email, username, password, firstName, lastName, null)

      and: "mock the database with some users already registered"
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> user

      when: "creating a user"
      userController.createUser(user)

      then: "should throw UserAlreadyExistsException"
      thrown(UserAlreadyExistsException)
   }

   @Test
   def "Should register an Alpaca key to a user successfully"() {
      given: "A registered user with an Alpaca key"
      String email = "moneytree@test.com"
      String username = "Billy"
      String password = "encrypted"
      String firstName = "Billy"
      String lastName = "Bob"
      String alpacaApiKey = "RYFERH6ET5etETGTE6"
      User user = createUser(email, username, password, firstName, lastName, alpacaApiKey)

      and: "mock the database with the same user already registered"
      userDao.findUserById(user.getId()) >> user

      and: "mock the database with to save the user"
      userDao.save(user) >> user

      when: "registering a key to a user"
      def response = userController.registerAlpacaApiKey(user.getId(), alpacaApiKey)

      then: "should register a key"
      assert response.statusCode == HttpStatus.OK
      assert response.body.email == email
      assert response.body.username == username
      assert response.body.password == password
      assert response.body.firstName == firstName
      assert response.body.lastName == lastName
      assert response.body.alpacaApiKey == alpacaApiKey
   }

   @Test
   def "Should not register an Alpaca key to the user if key is empty"() {
      given: "A registered user with an empty key"
      String email = "moneytree@test.com"
      String username = "Billy"
      String password = "encrypted"
      String firstName = "Billy"
      String lastName = "Bob"
      String alpacaApiKey = ""
      User user = createUser(email, username, password, firstName, lastName, alpacaApiKey)

      when: "registering a key to a user"
      userController.registerAlpacaApiKey(user.getId(), alpacaApiKey)

      then:
      thrown(EntityNotFoundException)
   }

   @Test
   def "Should not register an Alpaca key to the user if user does not exists"() {
      given: "A registered user with an Alpaca key"
      String email = "moneytree@test.com"
      String username = "Billy"
      String password = "encrypted"
      String firstName = "Billy"
      String lastName = "Bob"
      String alpacaApiKey = "RYFERH6ET5etETGTE6"
      User user = createUser(email, username, password, firstName, lastName, alpacaApiKey)

      and: "mock the database with a user that's not found in the database"
      userDao.findUserByEmailAndUsername(email, username) >> null

      when: "registering a key to a user"
      userController.registerAlpacaApiKey(user.getId(), alpacaApiKey)

      then: "should throw EntityNotFoundException"
      thrown(EntityNotFoundException)
   }
  
     @Test
    def "Login Test"(){
        given: "A registeredUser"
        String password = "password123"
        User registeredUser = createUser("user.user@money-tree.tech", "usr", password, "user", "user", null);
        //encrypts the password
        userController.createUser(registeredUser)
        //mock userDao.findUserByEmail()
        userDaoMock.findUserByEmail(registeredUser.getEmail()) >> registeredUser

        and: "A set credentialOk"
        User credentialOk = createCredential(registeredUser.getEmail(), password)

        and: "A set of credentialUnregisteredUser"
        User credentialUnregisteredUser = createCredential("tamvanum@money-tree.tech", "tamvanum")

        and: "A set of credentialWrongPassword"
        User credentialWrongPassword = createCredential(registeredUser.getEmail(), "tamvanum")

        when: "Attempt login with credentialOk"
        User attempt0 = userController.login(credentialOk)
        then: "Should return registeredUser"
        attempt0 == registeredUser

        when: "Attempt login with credentialUnregisteredUser"
        userController.login(credentialUnregisteredUser)
        then: "Should throw CredentialsNotFoundException"
        thrown(CredentialNotFoundException)

        when: "Attempt login with credentialWrongPassword"
        userController.login(credentialWrongPassword)
        then: "Should throw CredentialNotFoundException"
        thrown(CredentialNotFoundException)
    }
}
