package com.capstone.moneytree.exception

import spock.lang.Specification

class AlpacaExceptionTest extends Specification {

    def "Should initialize AlpacaException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        AlpacaException alpacaException = new AlpacaException(message)

        then:
        alpacaException != null
        alpacaException.getMessage() == message
    }
}
