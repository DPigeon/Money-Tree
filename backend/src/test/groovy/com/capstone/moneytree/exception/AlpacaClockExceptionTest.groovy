package com.capstone.moneytree.exception

import spock.lang.Specification

class AlpacaClockExceptionTest extends Specification {

    def "Should initialize AlpacaClockException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        AlpacaClockException alpacaClockException = new AlpacaClockException(message)

        then:
        alpacaClockException != null
        alpacaClockException.getMessage() == message
    }
}
