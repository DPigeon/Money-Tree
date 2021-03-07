package com.capstone.moneytree.controller

import com.capstone.moneytree.service.impl.DefaultTransactionService

import net.jacobpeterson.domain.alpaca.order.Order
import spock.lang.Specification


class TransactionControllerTest extends Specification {

   DefaultTransactionService transactionService = Mock()
   def transactionController = new TransactionController(transactionService)

   def "Validate executeTransaction call the service method with proper argument"() {
      given: " A string long id"
      def userId = "1232342452345"

      and: "A mock order"
      Order order = Mock()

      when: "We delegate the arguments to the service methods"
      transactionController.executeTransaction(userId, order)

      then: "Expect the method to be called once with proper arguments"
      1 * transactionService.execute(userId, order)
   }
}