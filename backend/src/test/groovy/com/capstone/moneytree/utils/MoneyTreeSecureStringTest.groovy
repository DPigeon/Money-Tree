package com.capstone.moneytree.utils

import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest
class MoneyTreeSecureStringTest extends Specification {

    private MoneyTreeSecureString moneyTreeSecureString

    def setup() {
        moneyTreeSecureString = new MoneyTreeSecureString()
    }

    def "It should encrypt a string"() {
        given: "a string"
        String text = "hello"

        when: "encrypting the string"
        String encryptedText = moneyTreeSecureString.toGraphProperty(text)

        then: "should have encrypted the text"
        assert encryptedText != text
    }

    def "It should decrypt a string"() {
        given: "a string"
        String text = "test"

        when: "decrypting the string with an encrypted text"
        String encryptedText = moneyTreeSecureString.toGraphProperty(text)
        String decryptedText = moneyTreeSecureString.toEntityAttribute(encryptedText)

        then: "should have decrypted the text"
        assert decryptedText == text
    }
}
