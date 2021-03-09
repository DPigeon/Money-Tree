package com.capstone.moneytree.exception

import spock.lang.Specification

class InvalidMediaFileExceptionTest extends Specification {

    def "Should initialize InvalidMediaFileException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        InvalidMediaFileException invalidMediaFileException = new InvalidMediaFileException(message)

        then:
        invalidMediaFileException != null
        invalidMediaFileException.getMessage() == message
    }
}
