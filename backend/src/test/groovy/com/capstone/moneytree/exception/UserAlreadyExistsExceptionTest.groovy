package com.capstone.moneytree.exception

import spock.lang.Specification

class UserAlreadyExistsExceptionTest extends Specification {

    def "Should initialize UserAlreadyExistsException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        UserAlreadyExistsException userAlreadyExistsException = new UserAlreadyExistsException(message)

        then:
        userAlreadyExistsException != null
        userAlreadyExistsException.getMessage() == message
    }
}
