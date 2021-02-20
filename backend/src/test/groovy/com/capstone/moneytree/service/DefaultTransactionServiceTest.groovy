package com.capstone.moneytree.service

import com.capstone.moneytree.dao.TransactionDao
import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.model.MoneyTreeOrderType
import com.capstone.moneytree.service.api.TransactionService
import com.capstone.moneytree.service.impl.DefaultTransactionService

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.buildTransactions

import spock.lang.Specification


class DefaultTransactionServiceTest extends Specification {

   TransactionDao transactionDao = Mock()
   UserDao userDao = Mock()
   TransactionService transactionService = new DefaultTransactionService(transactionDao, userDao)

   def "Validate that findAll calls the transactionDao"() {
      when:
      transactionService.getAllTransactions()

      then:
      1 * transactionDao.findAll()
   }

   def "Validate that findTransactionsByOrderType filters correctly"() {
      given: "A list of transaction with different order type"
      transactionDao.findAll() >> buildTransactions()

      when: "We get all the market buy type of transactions"
      def marketBuyTransactions = transactionService.getTransactionsByOrderType(MoneyTreeOrderType.MARKET_BUY)

      then: "We should have only 3 transactions"
      marketBuyTransactions.size() == 3
      marketBuyTransactions.forEach({
         it.getMoneyTreeOrderType() == MoneyTreeOrderType.MARKET_BUY
      })
   }


}