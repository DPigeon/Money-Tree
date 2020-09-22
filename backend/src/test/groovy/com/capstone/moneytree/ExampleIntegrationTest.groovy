package com.capstone.moneytree

import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification
import spock.lang.Unroll

@SpringBootTest
class ExampleIntegrationTest extends Specification {

    private final static USER_GROUPS = ["ReadGroup", "WriteGroup", "UpdateGroup", "DeleteGroup"]

    def cleanup() {
        //Running once after every single test
    }

    def setup() {
        //Running before every single test
    }

    def cleanupSpec() {
        //Running once after all test in the file
    }

    def setupSpec() {
        //Running once before all test in the file
    }

    @Test
    def "one plus one should equal two"() {
        expect:
        1 + 1 == 2
    }

    @Test
    def "A user should be able to post comments"() {
        given: "A user exist"
        //Code here

        and: "Has rights to posts comments"
        //Code here

        when: "user posts comments"
        //Code here

        then: "comments are created"
        //Code here
    }

    @Test
    def "Clean up and setup can also be within the test block"() {
        setup: "setting up test"
        //set up code

        cleanup: "cleaning up code"
        //clean up code
    }

    @Test
    @Unroll
    def "Test can be combined when testing with different values/inputs. Testing if a number is even or not"() {
        given: "A number #x"
        def num = x

        when: "Is even"
        def isEven = isEven(num)

        then: "returns true"
        isEven == condition

        where:
        condition | x
        true      | 2
        true      | 4
        false     | 11
        false     | 13

        /* This test will loop and replace values of condition and x and iterate until done. Will loop 4 times */
    }

    @Test
    def "Test with list using groovy closure"() {
        given: "empty list"
        def newList = []
        when: "capitalize all group names"
        def users = USER_GROUPS.forEach({ user -> newList.add(user.toUpperCase())})

        /* Groovy has closures (similarly to javascript) which you can pass in functions instead of using for loops
        * There are many utiliy functions for dealing with collections. */

        then: "all groups should be capitalized"
        USER_GROUPS.forEach({ user ->
            assert newList.contains(user.toUpperCase())
        })
    }

    def isEven(int num) {
        return num % 2 == 0
    }

    def capitalizeList(List<String> users) {
        return users.forEach()
    }
}
