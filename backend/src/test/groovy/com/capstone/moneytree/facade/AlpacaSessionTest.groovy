package com.capstone.moneytree.facade

import com.capstone.moneytree.exception.BadRequestException

import spock.lang.Specification

class AlpacaSessionTest extends Specification {

   def alpacaSession = new AlpacaSession()

   def "Should throw an exception if the user token is null"() {
      given:
      def userToken = null

      when:
      alpacaSession.alpaca("1", userToken)

      then:
      thrown(NullPointerException)
   }

   def "Should throw an exception if the user token is empty"() {
      given:
      def userToken = ""

      when:
      alpacaSession.alpaca("2", userToken)

      then:
      thrown(BadRequestException)
   }

   def "Should return the AlpacaAPI when token is valid"() {
      given:
      def userToken = "jh34g2j-23hg4j2-2jhg424"

      when:
      def api = alpacaSession.alpaca("1", userToken)

      then:
      api != null
   }
}