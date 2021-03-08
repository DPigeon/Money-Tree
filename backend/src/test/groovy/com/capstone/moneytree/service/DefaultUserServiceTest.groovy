package com.capstone.moneytree.service

import com.capstone.moneytree.dao.FollowsDao
import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.api.AmazonS3Service
import com.capstone.moneytree.service.api.UserService
import com.capstone.moneytree.service.impl.DefaultUserService
import com.capstone.moneytree.validator.UserValidator
import com.capstone.moneytree.validator.ValidatorFactory
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createCredential
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.getMultipartFile

/**
 * This class is used to test all basic implementation for the User Service.
 */
class DefaultUserServiceTest extends Specification {

    private static String BUCKET_NAME = System.getenv("AWS_PROFILE_PICTURES_BUCKET")

    UserDao userDao = Mock()
    FollowsDao followsDao = Mock()
    AmazonS3Service amazonS3Service = Mock()
    ValidatorFactory validatorFactory = Mock(ValidatorFactory) {
        UserValidator userValidator = Mock()
        it.getUserValidator() >> userValidator
    }
    UserService userService = new DefaultUserService(userDao, followsDao, validatorFactory, amazonS3Service, BUCKET_NAME)

    def "Should get all users by calling the database once"() {
        given:
        List<User> list = List.of(
                createUser("test@test.com", "user", "pass", "User", "Yes", "44y-h4ye"),
                createUser("test1@test.com", "use", "pass", "Use", "Yes", "44y-33h4ye")
        )

        and: "mock database"
        userDao.findAll() >> list

        when:
        List<User> userList = userService.getAllUsers() as List<User>

        then:
        userList != null
        userList == list
    }

    def "Should get a user by ID"() {
        given:
        User user = createUser("test1@test.com", "use", "pass", "Use", "Yes", "44y-33h4ye")
        user.setId(1)

        and:
        userDao.findUserById(user.getId()) >> user

        when:
        User userResponse = userService.getUserById(user.getId())

        then:
        userResponse != null
        userResponse == user
    }

    def "Should get user by email and username"() {
        given:
        String email = "test@test.com"
        String username = "test"
        User user = createUser(email, username, "pass", "Use", "Yes", "44y-33h4ye")

        and:
        userDao.findUserByEmailAndUsername(email, username) >> user

        when:
        User userResponse = userService.getUserByEmailAndUsername(email, username)

        then:
        userResponse != null
        userResponse.getEmail() == email
        userResponse.getUsername() == username
    }

    def "Should create user"() {
        given:
        User user = createUser("test@test.com", "test", "pass", "Use", "Yes", "44y-33h4ye")

        and:
        userDao.save() >> user

        when:
        User userResponse = userService.createUser(user)

        then:
        userResponse != null
        userResponse == user
    }

    def "Should edit user profile picture"() {
        given:
        String imageUrl = "http://test-url"
        MultipartFile image = getMultipartFile()
        User user = createUser("test@test.com", "test", "pass", "Use", "Yes", "44y-33h4ye")

        and:
        amazonS3Service.uploadImageToS3Bucket(image, BUCKET_NAME) >> imageUrl
        userDao.save() >> user

        when:
        User userResponse = userService.editUserProfilePicture(user, image, "test")

        then:
        userResponse != null
        userResponse.avatarURL == imageUrl
    }

    def "Should not be able to register Alpaca API key if code is invalid"() {
        given:
        Long userId = 1
        String code = "test-code"
        User user = createUser("test@test.com", "test", "pass", "Use", "Yes", "44y-33h4ye")

        and:
        userDao.findUserById(userId) >> user
        userDao.save() >> user

        when:
        User userResponse = userService.registerAlpacaApiKey(userId, code)

        then:
        userResponse != null
    }

    def "Should login a user"() {
        given:
        User user = createUser("test@test.com", "test", "pass", "Use", "Yes", "44y-33h4ye")
        User credentials = createCredential(user.getEmail(), user.getPassword())

        and:
        userService.createUser(user)
        userDao.findUserByEmail(user.getEmail()) >> user

        when:
        User userResponse = userService.login(credentials)

        then:
        userResponse != null
        userResponse.getUsername() == user.getUsername()
    }

    def "Should follow a user"() {
        
    }

    def "Should unfollow a user"() {

    }

    def "Should get followings"() {

    }

    def "Should get followers"() {

    }

    def "Should delete user by email"() {

    }

    def "Should get searched users"() {

    }
}
