package com.capstone.moneytree

import spock.lang.Specification


class ActiveProfileTest extends Specification {

   ActiveProfile activeProfile = new ActiveProfile()

   def "Given  #activeProfile profile, we should receive local url"() {
      given:
      activeProfile.activeProfile = profile

      when:
      def url = activeProfile.getApplicationUrl()

      then:
      url == urlProfile

      where:
      profile | urlProfile
      "local" | "http://localhost:4200/"
      "dev"   | "https://dev.money-tree.tech/"
      "prod"  | "https://money-tree.tech/"
   }
}