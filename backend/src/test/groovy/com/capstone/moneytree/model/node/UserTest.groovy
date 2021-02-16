package com.capstone.moneytree.model.node

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import org.junit.Test
import spock.lang.Specification

/**
 * Unit Tests for the User model.
 */
class UserTest extends Specification {

    private static User user

    def setup() {
        user = createUser(1, "test@test.com", "username", "password", "Jake", "Moreau", "123B")
    }

    @Test
    def "Should follow a user"() {
        given: "another user"
        User user2 = createUser(2, "test2@test.com", "username2", "password2", "Will", "Moreau", "123C")

        when: "follow another user"
        user.follow(user2)

        then: "should be added to the followers"
        assert user.getFollowers().size() == 1
        assert user.getFollowers().contains(user2)
    }

    @Test
    def "Should unfollow a user"() {
        given: "another user"
        User user2 = createUser(2, "test2@test.com", "username2", "password2", "Will", "Moreau", "123C")

        when: "unfollow another user already followed by user1"
        Set<User> followers = new HashSet<>();
        followers.add(user2)
        user.setFollowers(followers)
        user.unfollow(user2)

        then: "should be removed from the followers"
        assert user.getFollowers().size() == 0
    }

    @Test
    def "Should create a new set of followers if following first person ever"() {
        given: "another user"
        User user2 = createUser(2, "test2@test.com", "username2", "password2", "Will", "Moreau", "123C")

        assert user2.getFollowers() == null
        when: "follow another user by creating a fresh set for followers"
        user.follow(user2)

        then: "should be added to the followers"
        assert user.getFollowers().size() == 1
    }
}
