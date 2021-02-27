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
        user = createUser("test@test.com", "username", "password", "Jake", "Moreau", "123B")
    }
}
