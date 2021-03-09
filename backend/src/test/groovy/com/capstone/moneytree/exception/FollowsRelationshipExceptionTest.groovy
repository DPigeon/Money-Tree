package com.capstone.moneytree.exception

import spock.lang.Specification

class FollowsRelationshipExceptionTest extends Specification {

    def "Should initialize EntityNotFoundException"() {
        given: "A message"
        String message = "There is an error!"

        when:
        FollowsRelationshipException followsRelationshipException = new FollowsRelationshipException(message)

        then:
        followsRelationshipException != null
        followsRelationshipException.getMessage() == message
    }
}
