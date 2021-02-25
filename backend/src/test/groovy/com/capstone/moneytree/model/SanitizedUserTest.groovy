package com.capstone.moneytree.model

import com.capstone.moneytree.model.node.User
import org.junit.Test

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*
import spock.lang.Specification

/**
 * Unit Tests for the SanitizedUser model.
 */
class SanitizedUserTest extends Specification {
    @Test
    def "it should create a SanitizedUser from a User"() {

        given: "a User object created from User class"
        User newUser = new User()
        newUser.setId(1)
        newUser.setFirstName("John")
        newUser.setLastName("Doe")
        newUser.setUsername("JohnDoeUsername")
        newUser.setBalance(2000)
        newUser.setEmail("JohnDoe@test.com")
        newUser.setAlpacaApiKey("skjfb22978@dfbsous!")
        newUser.setBiography("This is bio for newUser in test")
        newUser.setAvatarURL("default-profile-picture.jpg")
        newUser.setCoverPhotoURL("cover-photo.jpg")
        newUser.setPassword("newUserPassword")
        newUser.setScore(100)
        newUser.setRank(4)

        when: "creating a SanitizedUser out of the given user"
        SanitizedUser sanitizedUser = new SanitizedUser(newUser)

        then: "should create a SanitizedUser by keeping the important fields of user only"
        assert sanitizedUser.getId() == newUser.getId()
        assert sanitizedUser.getFirstName() == newUser.getFirstName()
        assert sanitizedUser.getLastName() == newUser.getLastName()
        assert sanitizedUser.getUsername() == newUser.getUsername()
        assert sanitizedUser.getAvatarURL() == newUser.getAvatarURL()
        assert sanitizedUser.getCoverPhotoURL() == newUser.getCoverPhotoURL()
        assert sanitizedUser.getBiography() == newUser.getBiography()
        assert sanitizedUser.getScore() == newUser.getScore()
        assert sanitizedUser.getRank() == newUser.getRank()
        assert sanitizedUser.getBalance() == newUser.getBalance()
    }
}

