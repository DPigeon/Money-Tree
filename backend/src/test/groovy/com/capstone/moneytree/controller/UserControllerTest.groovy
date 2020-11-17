package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.EntityNotFoundException
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.impl.DefaultUserService
import com.google.common.collect.Lists
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

    private UserController userController
    private DefaultUserService defaultUserService
    private UserDao userDaoMock

    def setup() {
        userDaoMock = Mock()
        defaultUserService = new DefaultUserService(userDaoMock)
        userController = new UserController(defaultUserService)
    }

    @Test
    def "Should register a user successfully"() {
        given: "a user from user fields and another mocked user"
        String email = "test@test.com"
        String username = "Test"
        String password = "encrypted"
        String firstName = "John"
        String lastName = "Doe"
        User user = createUser(email, username, password, firstName, lastName, null);

        and: "mock the database with some users already registered"
        userDaoMock.findAll() >> createUsersInMockedDatabase()

        and: "mock the database to save the user"
        userDaoMock.save(user) >> user

        when: "creating a user"
        def response = userController.createUser(user)

        then: "should create a user"
        assert response.statusCode == HttpStatus.OK
        assert response.body.email == email
        assert response.body.username == username
        assert defaultUserService.compareDigests(password, response.body.password)
        assert response.body.firstName == firstName
        assert response.body.lastName == lastName
    }

    @Test
    def "Should not register a user with any empty fields"() {
        given: "a user with empty fields"
        String email = ""
        String username = "Test"
        String password = "encrypted"
        String firstName = ""
        String lastName = "Doe"
        User user = createUser(email, username, password, firstName, lastName, null);

        when: "creating a user"
        userController.createUser(user)

        then: "should throw IllegalArgumentException"
        thrown(IllegalArgumentException)
    }

    @Test
    def "Should not register a user if email already exists"() {
        given: "a user with email already registered"
        String email = "cath@test.com"
        String username = "Kathe"
        String password = "encrypted"
        String firstName = "Katherine"
        String lastName = "Jill"
        User user = createUser(email, username, password, firstName, lastName, null);

        and: "mock the database with some users already registered"
        userDaoMock.findUserByEmailAndUsername(email, username) >> user

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
        User user = createUser(email, username, password, firstName, lastName, null);

        and: "mock the database with some users already registered"
        userDaoMock.findUserByEmailAndUsername(email, username) >> user

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
        User user = createUser(email, username, password, firstName, lastName, alpacaApiKey);

        and: "mock the database with the same user already registered"
        userDaoMock.findUserById(user.getId()) >> user

        and: "mock the database with to save the user"
        userDaoMock.save(user) >> user

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
        User user = createUser(email, username, password, firstName, lastName, alpacaApiKey);

        when: "registering a key to a user"
        userController.registerAlpacaApiKey(user.getId(), alpacaApiKey)

        then:
        thrown(IllegalArgumentException)
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
        User user = createUser(email, username, password, firstName, lastName, alpacaApiKey);

        and: "mock the database with a user that's not found in the database"
        userDaoMock.findUserByEmailAndUsername(email, username) >> null

        when: "registering a key to a user"
        userController.registerAlpacaApiKey(user.getId(), alpacaApiKey)

        then: "should throw EntityNotFoundException"
        thrown(EntityNotFoundException)
    }

    User createUser(String email, String username, String password, String firstName, String lastName, String alpacaApiKey) {
        return User.builder()
                .email(email)
                .username(username)
                .password(password)
                .firstName(firstName)
                .lastName(lastName)
                .alpacaApiKey(alpacaApiKey)
                .build();
    }

    User createCredential(String email, String password) {
        return User.builder()
                .email(email)
                .password(password)
                .build();
    }

    def createUsersInMockedDatabase() {
        User user1 = createUser("yuu@test.com", "yury1", "hello1", "Yury", "Krystler", null)
        User user2 = createUser("cath@test.com", "Cath", "hello2", "Catherine", "Kole", null)
        User user3 = createUser("joe@test.com", "Joe", "hello3", "Joe", "Wert", null)
        return Lists.asList(user1, user2, user3)
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
