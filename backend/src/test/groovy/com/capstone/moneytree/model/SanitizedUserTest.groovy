package com.capstone.moneytree.model
import com.capstone.moneytree.model.node.User
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*
import spock.lang.Specification

/**
 * Unit Tests for the SanitizedUser model.
 */
class SanitizedUserTest extends Specification {
    private static SanitizedUser sanitizedUser;

    def setup() {
        User user = createUser(1, "test@test.com", "username", "password", "Jake", "Moreau", "123B")
        sanitizedUser = new SanitizedUser(user)
    }
}

