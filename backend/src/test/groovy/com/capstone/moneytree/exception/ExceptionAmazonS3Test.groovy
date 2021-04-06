package com.capstone.moneytree.exception

import spock.lang.Specification

class ExceptionAmazonS3Test extends Specification {

    def "Should initialize ExceptionAmazonS3"() {
        given: "A message"
        String message = "There is an error!"

        when:
        ExceptionAmazonS3 exceptionAmazonS3 = new ExceptionAmazonS3(message)

        then:
        exceptionAmazonS3 != null
        exceptionAmazonS3.getMessage() == message
    }
}

