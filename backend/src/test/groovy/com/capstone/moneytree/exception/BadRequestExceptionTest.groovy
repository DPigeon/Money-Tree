package com.capstone.moneytree.exception

import spock.lang.Specification

class BadRequestExceptionTest extends Specification {

    def "Should initialize BadRequestException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        BadRequestException badRequestException = new BadRequestException(message)

        then:
        badRequestException != null
        badRequestException.getMessage() == message
    }
}
