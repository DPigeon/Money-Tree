package com.capstone.moneytree.exception

import spock.lang.Specification

class MissingMandatoryFieldExceptionTest extends Specification {

    def "Should initialize MissingMandatoryFieldException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        MissingMandatoryFieldException missingMandatoryFieldException = new MissingMandatoryFieldException(message)

        then:
        missingMandatoryFieldException != null
        missingMandatoryFieldException.getMessage() == message
    }
}
