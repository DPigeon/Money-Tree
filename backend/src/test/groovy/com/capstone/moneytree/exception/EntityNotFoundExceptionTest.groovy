package com.capstone.moneytree.exception

import spock.lang.Specification

class EntityNotFoundExceptionTest extends Specification {

    def "Should initialize EntityNotFoundException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        EntityNotFoundException entityNotFoundException = new EntityNotFoundException(message)

        then:
        entityNotFoundException != null
        entityNotFoundException.getMessage() == message
    }
}
