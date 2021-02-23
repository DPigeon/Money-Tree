package com.capstone.moneytree.utils

import org.junit.Test
import spock.lang.Specification

class MoneyTreePasswordEncryptionTest extends Specification {

    private MoneyTreePasswordEncryption passwordEncryption

    def setup() {
        passwordEncryption = new MoneyTreePasswordEncryption()
    }

    @Test
    def "It should encrypt a password"() {
        given: "a password"
        String password = "hello"

        when: "encrypting the password"
        String encryptedPassword = passwordEncryption.toGraphProperty(password)

        then: "should have encrypted the text"
        assert passwordEncryption.checkPassword(password, encryptedPassword)
    }

    @Test
    def "It should not login if the password is not the same"() {
        given: "a password"
        String password = "not_equal"

        when: "encrypting the password"
        String encryptedPassword = passwordEncryption.toGraphProperty(password)

        then: "should not have same digests"
        assert !passwordEncryption.checkPassword("equal", encryptedPassword)
    }
}
