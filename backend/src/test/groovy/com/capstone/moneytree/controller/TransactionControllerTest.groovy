package com.capstone.moneytree.controller

import com.capstone.moneytree.model.node.Transaction
import com.capstone.moneytree.service.impl.DefaultTransactionService

import net.jacobpeterson.domain.alpaca.order.Order
import spock.lang.Specification


class TransactionControllerTest extends Specification {

   DefaultTransactionService transactionService = Mock()
   def transactionController = new TransactionController(transactionService)

   def "Should get all transactions"() {
      given: "Transactions"
      List<Transaction> transactions = new ArrayList<>()

      and: "mock the database"
      transactionService.getAllTransactions() >> transactions

      when: "Get all of them"
      List<Transaction> transactionList = transactionController.all()

      then:
      transactionList != null
      transactionList.isEmpty()
   }

   def "Validate executeTransaction call the service method with proper argument"() {
      given: "A string long id"
      def userId = "1232342452345"

      and: "A mock order"
      Order order = Mock()

      when: "We delegate the arguments to the service methods"
      transactionController.executeTransaction(userId, order)

      then: "Expect the method to be called once with proper arguments"
      1 * transactionService.execute(userId, order)
   }

   def "Should get user transactions"() {
      given: "A user ID and empty transactions"
      String userId = "1"
      List<Transaction> transactions = new ArrayList<>()

      and: "mock database"
      transactionService.getUserTransactions(Long.parseLong(userId)) >> transactions

      when: "We get the user transactions"
      List<Transaction> list = transactionController.getUserTransactions(userId)

      then: "Should have a list response"
      list != null
   }
}