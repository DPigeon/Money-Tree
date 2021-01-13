package com.capstone.moneytree.controller

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import java.nio.file.Files
import java.nio.file.Paths

import javax.security.auth.login.CredentialNotFoundException

import org.junit.Test
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockMultipartFile
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.multipart.MultipartFile

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.*
import com.capstone.moneytree.facade.AmazonS3Facade
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.service.api.AmazonS3Service
import com.capstone.moneytree.service.api.UserService
import com.capstone.moneytree.service.impl.DefaultAmazonS3Service
import com.capstone.moneytree.service.impl.DefaultUserService
import com.capstone.moneytree.validator.UserValidator
import com.capstone.moneytree.validator.ValidatorFactory

import spock.lang.Specification

/**
 * Unit Tests for the User Controller.
 */
class UserControllerTest extends Specification {
   private static final String PIC_FILE_NAME = "profile.jpg"

   private static String S3_ACCESS_KEY = System.getenv("AWS_ACCESS_KEY")
   private static String S3_SECRET_KEY = System.getenv("AWS_SECRET_ACCESS_KEY")
   private static String BUCKET_NAME = System.getenv("AWS_PROFILE_PICTURES_BUCKET")

   private static UserDao userDao
   private static UserValidator userValidator
   private static ValidatorFactory validatorFactory
   private static UserService defaultUserService
   private static UserController userController
   private static AmazonS3Service amazonS3Service
   private static AmazonS3Facade amazonS3Facade

   def setup() {
      userDao = Mock()
      userValidator = new UserValidator(userDao)
      validatorFactory = Mock(ValidatorFactory) {
         it.getUserValidator() >> userValidator
      }
      MockHttpServletRequest request = new MockHttpServletRequest()
      RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request))
      amazonS3Facade = new AmazonS3Facade(S3_ACCESS_KEY, S3_SECRET_KEY)
      amazonS3Service = new DefaultAmazonS3Service(amazonS3Facade)
      defaultUserService = new DefaultUserService(userDao, validatorFactory, amazonS3Service, BUCKET_NAME)
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
      User user = createUser(email, username, password, firstName, lastName, null)

      and: "mock the database with some users already registered"
      userDao.findAll() >> createUsersInMockedDatabase()
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> null

      and: "mock the database to save the user"
      userDao.save(user) >> user

      when: "creating a user"
      def response = userController.createUser(user)

      then: "should create a user"
      response.statusCode == HttpStatus.OK
      response.getBody() == user
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
   def "Login Test"() {
      given: "A registeredUser"
      String password = "password123"
      User registeredUser = createUser("user.user@money-tree.tech", "usr", password, "user", "user", null)
      //encrypts the password
      userController.createUser(registeredUser)
      //mock userDao.findUserByEmail()
      userDao.findUserByEmail(registeredUser.getEmail()) >> registeredUser

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

   @Test
   def "Edit User is returns an exception if the provided image is empty"() {
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

      and: "A MultipartFile"
      MultipartFile imageFile = Mock()
      imageFile.isEmpty() >> true

      when: "Attempt to editUserProfile without a png file"
      userController.editUserProfile(user.getId(), imageFile)

      then:
      thrown(InvalidMediaFileException)
   }

   @Test
   def "Edit User is returns an exception if the provided image is null"() {
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

      and: "A MultipartFile"
      MultipartFile imageFile = null

      when: "Attempt to editUserProfile without a png file"
      userController.editUserProfile(user.getId(), imageFile)

      then:
      thrown(InvalidMediaFileException)
   }

   @Test
   def "Edit User is successful if the user uploads its first picture ever"() {
      given: "A registered user"
      def user = new User(
              id: 123,
              email: "moneytree@test.com",
              username: "Billy",
              password: "encrypted",
              firstName: "Billy",
              lastName: "Bob"
      )

      and: "mock the database with the same user already registered"
      userDao.findUserById(user.getId()) >> user

      when: "Attempt to editUserProfile"
      def response = userController.editUserProfile(user.getId(), getMultipartFile())

      then: "The returned avatar url contains the profile picture name uploaded by the user"
      with(response) {
         getBody().getAvatarURL() != null
         getBody().getAvatarURL() != ""
         getBody().getAvatarURL().contains(PIC_FILE_NAME)
      }

      cleanup: "Recopy file locally for other tests"
      Files.copy(Paths.get("./src/test/resources/${PIC_FILE_NAME}"), Paths.get("./src/test/resources/image/${PIC_FILE_NAME}"))
   }

   @Test
   def "Edit User successfully deletes the previous avatar when present"() {
      given: "A registered user"
      def user = new User(
              id: 123,
              email: "moneytree@test.com",
              username: "Billy",
              password: "encrypted",
              firstName: "Billy",
              lastName: "Bob"
      )

      and: "Get multipart file from request"
      def image = getMultipartFile()

      and: "User has already an avatar url"
      user.setAvatarURL(uploadNewAvatar())

      and: "mock the database with the same user already registered"
      userDao.findUserById(user.getId()) >> user

      when: "Attempt to editUserProfile"
      def response = userController.editUserProfile(user.getId(), image)

      then: "The returned avatar url contains the profile picture name uploaded by the user"
      with(response) {
         getBody().getAvatarURL() != null
         getBody().getAvatarURL() != ""
         getBody().getAvatarURL().contains(PIC_FILE_NAME)
      }

      cleanup: "Recopy file locally for other tests"
      Files.copy(Paths.get("./src/test/resources/${PIC_FILE_NAME}"), Paths.get("./src/test/resources/image/${PIC_FILE_NAME}"))
   }

   @Test
   def "Edit User throws exception when image is null"() {
      given: "A registered user"
      def user = new User(
              id: 123,
              email: "moneytree@test.com",
              username: "Billy",
              password: "encrypted",
              firstName: "Billy",
              lastName: "Bob"
      )

      and: "mock the database with the same user already registered"
      userDao.findUserById(user.getId()) >> user

      when: "Attempt to editUserProfile when image is null"
      userController.editUserProfile(user.getId(), null)

      then: "throws an invalidMediaException"
      thrown(InvalidMediaFileException)
   }

   @Test
   def "Edit User throws exception when image is empty"() {
      given: "A registered user"
      def user = new User(
              id: 123,
              email: "moneytree@test.com",
              username: "Billy",
              password: "encrypted",
              firstName: "Billy",
              lastName: "Bob"
      )

      and: "mock the database with the same user already registered"
      userDao.findUserById(user.getId()) >> user

      and: "image is empty but not null"
      MockMultipartFile imageFile = Mock() {
         isEmpty() >> true
      }

      when: "Attempt to editUserProfile when image is empty but not null"
      userController.editUserProfile(user.getId(), imageFile)

      then: "throws an invalidMediaException"
      thrown(InvalidMediaFileException)
   }

   @Test
   def "converting to multipart to file throws exception when the file does not exist"() {
      given: "An empty file"
      def image = Mock(File) {
         exists() >> false
      }

      and: "mocking the facade"
      def mockAmazonS3Facade = Spy(AmazonS3Facade, constructorArgs: ["", ""]) {
         convertMultiPartToFile(_ as MultipartFile) >> image
      }

      when:
      mockAmazonS3Facade.uploadImageToS3Bucket(_ as MultipartFile, _ as String)

      then: "throws an ExceptionAmazonS3"
      thrown(ExceptionAmazonS3)
   }

   @Test
   def "deleting a file returns nothing when the url provided is empty"() {
      when: "the upload operation to return with no exception thrown"
      amazonS3Facade.deleteImageFromS3Bucket(_ as String, null)

      then: "No exception is thrown"
      notThrown(Exception)
   }

   def uploadNewAvatar() {
      File file = new File("./src/test/resources/image/${PIC_FILE_NAME}")
      MockMultipartFile imageFile = new MockMultipartFile(file.getName(), file.getAbsolutePath(), null, file.getBytes())
      return amazonS3Facade.uploadImageToS3Bucket(imageFile, BUCKET_NAME)
   }

   def getMultipartFile() {
      File file = new File("./src/test/resources/image/${PIC_FILE_NAME}")
      return new MockMultipartFile(file.getName(), file.getAbsolutePath(), null, file.getBytes())
   }
}

