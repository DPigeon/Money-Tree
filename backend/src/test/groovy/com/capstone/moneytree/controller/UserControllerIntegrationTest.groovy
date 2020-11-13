package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.impl.DefaultUserService
import com.google.common.collect.Lists
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Specification

/**
 * Integration Tests for the User Controller.
 */

@SpringBootTest
class UserControllerIntegrationTest extends Specification {

    private UserController userController
    private DefaultUserService defaultUserService
    private UserDao userDaoMock

    def setup() {
        userDaoMock = Stub(UserDao.class)
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
        User user = createUser(email, username, password, firstName, lastName);

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
        assert response.body.password == password
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
        User user = createUser(email, username, password, firstName, lastName);

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
        User user = createUser(email, username, password, firstName, lastName);

        and: "mock the database with some users already registered"
        userDaoMock.findAll() >> createUsersInMockedDatabase()

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
        User user = createUser(email, username, password, firstName, lastName);

        and: "mock the database with some users already registered"
        userDaoMock.findAll() >> createUsersInMockedDatabase()

        when: "creating a user"
        userController.createUser(user)

        then: "should throw UserAlreadyExistsException"
        thrown(UserAlreadyExistsException)
    }

    User createUser(String email, String username, String password, String firstName, String lastName) {
        return User.builder()
                .email(email)
                .username(username)
                .password(password)
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }

    def createUsersInMockedDatabase() {
        User user1 = createUser("yuu@test.com", "yury1", "hello1", "Yury", "Krystler")
        User user2 = createUser("cath@test.com", "Cath", "hello2", "Catherine", "Kole")
        User user3 = createUser("joe@test.com", "Joe", "hello3", "Joe", "Wert")
        return Lists.asList(user1, user2, user3)
    }
}
