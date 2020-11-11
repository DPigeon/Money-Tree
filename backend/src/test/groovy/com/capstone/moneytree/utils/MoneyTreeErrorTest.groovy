package com.capstone.moneytree.utils

import spock.lang.Specification


class MoneyTreeErrorTest extends Specification {

    def "Validate money tree error works with two error codes"() {
        given: "Two moneyTree error code"
        def invalidUser = MoneyTreeErrorCode.INVALID_USER
        def missingToken = MoneyTreeErrorCode.MISSING_TOKEN

        when: "We create a MoneyTreeError object"
        def errorInvalidUser = new MoneyTreeError(invalidUser)
        def errorMossingToken = new MoneyTreeError(missingToken)

        then: "The two errors are properly populated"
        errorInvalidUser.getErrorCode() == MoneyTreeErrorCode.INVALID_USER
        errorMossingToken.getErrorCode() == MoneyTreeErrorCode.MISSING_TOKEN

    }
}