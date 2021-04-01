package com.capstone.moneytree.model

import com.capstone.moneytree.model.node.User
import spock.lang.Specification

/**
 * Unit Tests for the UserCompleteProfile model.
 */
class UserCompleteProfileTest extends Specification {

    def "it should create a UserCompleteProfile from a User"() {
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

        when: "creating a UserCompleteProfile out of the given user"
        UserCompleteProfile completeUserProfile = new UserCompleteProfile(newUser)

        then: "should create a UserCompleteProfile"
        assert completeUserProfile.getId() == newUser.getId()
        assert completeUserProfile.getFirstName() == newUser.getFirstName()
        assert completeUserProfile.getLastName() == newUser.getLastName()
        assert completeUserProfile.getUsername() == newUser.getUsername()
        assert completeUserProfile.getAvatarURL() == newUser.getAvatarURL()
        assert completeUserProfile.getCoverPhotoURL() == newUser.getCoverPhotoURL()
        assert completeUserProfile.getBiography() == newUser.getBiography()
        assert completeUserProfile.getScore() == newUser.getScore()
        assert completeUserProfile.getRank() == newUser.getRank()
        assert completeUserProfile.getBalance() == newUser.getBalance()
        assert completeUserProfile.getTransactions() == null
        assert completeUserProfile.getOwnedStocks() == null
        assert completeUserProfile.getFollowing() == null
        assert completeUserProfile.getFollowers() == null
    }
}

