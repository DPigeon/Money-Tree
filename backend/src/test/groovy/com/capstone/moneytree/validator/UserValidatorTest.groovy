package com.capstone.moneytree.validator

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.exception.MissingMandatoryFieldException
import com.capstone.moneytree.handler.exception.UserAlreadyExistsException
import com.capstone.moneytree.model.node.User

import spock.lang.Specification


class UserValidatorTest extends Specification {

   UserValidator userValidator
   UserDao userDao
   User user

   def setup() {
      userDao = Mock()
      userValidator = new UserValidator(userDao)
   }

   def "validates the given user is valid"() {
      given: "A valid user"
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      user = createUser(email, username, password, firstName, lastName, "")

      and: "userDao returns null (no user such user in db)"
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> null

      when: "We validate a user"
      userValidator.validate(user)

      then:
      noExceptionThrown()
   }

   def "checks if the user class is supported by the UserValidation class"() {
      given: "A user"
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      user = createUser(email, username, password, firstName, lastName, "")

      when: "We validate a user"
      def isSupported = userValidator.supports(user.class)

      then:
      isSupported
   }

   def "validation throws MissingMandatoryFieldException if one of the fields is missing"() {
      given: "A valid user"
      user = createUser(email, username, password, firstName, lastName, "")

      and: "userDao returns null (no user such user in db)"
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> null

      when: "We validate a user"
      userValidator.validate(user)

      then:
      thrown(exception)

      where:
      email           | username | password    | firstName | lastName | exception
      ""              | "Test"   | "encrypted" | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | ""       | "encrypted" | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | ""          | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | "encrypted" | ""        | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | "encrypted" | "John"    | ""       | MissingMandatoryFieldException
      null            | "Test"   | "encrypted" | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | null     | "encrypted" | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | null        | "John"    | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | "encrypted" | null      | "Doe"    | MissingMandatoryFieldException
      "test@test.com" | "Test"   | "encrypted" | "John"    | null     | MissingMandatoryFieldException
   }

   def "validation throws UserAlreadyExistsException for the email and username field"() {
      given: "A user that already exist"
      String email = "test@test.com"
      String username = "Test"
      String password = "encrypted"
      String firstName = "John"
      String lastName = "Doe"
      user = createUser(email, username, password, firstName, lastName, "")

      and: "userDao returns null (no user such user in db)"
      userDao.findUserByEmailAndUsername(user.getEmail(), user.getUsername()) >> user

      when: "We validate a user"
      userValidator.validate(user)

      then:
      thrown(UserAlreadyExistsException)
   }
}