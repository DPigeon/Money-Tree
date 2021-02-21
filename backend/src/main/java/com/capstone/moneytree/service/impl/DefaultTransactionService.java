package com.capstone.moneytree.service.impl;



import java.util.List;
import java.util.stream.Collectors;


import com.capstone.moneytree.exception.AlpacaException;

import net.jacobpeterson.alpaca.enums.OrderSide;
import net.jacobpeterson.alpaca.enums.OrderTimeInForce;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.TransactionDao;
import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.facade.AlpacaSession;
import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.domain.alpaca.order.Order;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {
   private static final Logger LOGGER = LoggerFactory.getLogger(DefaultTransactionService.class);

   private final TransactionDao transactionDao;
   private final UserDao userDao;
   private final AlpacaSession session;

   @Autowired
   public DefaultTransactionService(TransactionDao transactionDao, UserDao userDao, AlpacaSession session) {
      this.transactionDao = transactionDao;
      this.userDao = userDao;
      this.session = session;
   }

   @Override
   public List<Transaction> getAllTransactions() {
      LOGGER.info("Getting all transactions...");
      return transactionDao.findAll();
   }

   @Override
   public List<Transaction> getTransactionsByOrderType(MoneyTreeOrderType moneyTreeOrderType) {
      List<Transaction> allTransactions = transactionDao.findAll();

      return allTransactions.stream()
              .filter(transaction -> transaction.getMoneyTreeOrderType().equals(moneyTreeOrderType))
              .collect(Collectors.toList());
   }


   @Override
   public User execute(String userId, Order order) {
      /* Get user for that transaction*/
      User user = getUser(Long.parseLong(userId));

      String alpacaKey = user.getAlpacaApiKey();

      /* Build the transaction and persist */
      Transaction transaction = executeTransaction(alpacaKey, order);

      /* Save the user by appending new transaction */
      if (transaction != null) {
         user.made(transaction);
         user = userDao.save(user);
      }
      return user;
   }

   private Transaction executeTransaction(String alpacaKey, Order order) {
      Transaction transaction;
      try {
         AlpacaAPI api = session.alpaca(alpacaKey);
         Order alpacaOrder = api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY);

         LOGGER.info("Executed order {}", alpacaOrder.getClientOrderId());

         transaction = constructTransactionFromOrder(alpacaOrder, api);

      } catch (Exception e) {
         throw new AlpacaException(e.getMessage());
      }
      return transaction;
   }

   private Transaction constructTransactionFromOrder(Order alpacaOrder, AlpacaAPI api) throws AlpacaAPIRequestException {
      return Transaction.builder()
              .status(TransactionStatus.PENDING)
              .purchasedAt(alpacaOrder.getCreatedAt())
              .clientOrderId(alpacaOrder.getClientOrderId())
              .moneyTreeOrderType(MoneyTreeOrderType.valueOf(alpacaOrder.getType().toUpperCase()+"_"+alpacaOrder.getSide().toUpperCase()))
              .quantity(Float.parseFloat(alpacaOrder.getQty()))
              // populate the stock which this transaction fulfills. Only asset field is populated for now
              .fulfilledStocks(List.of(Stock.builder().asset(api.getAssetBySymbol(alpacaOrder.getSymbol())).build()))
              .build();
   }

   private User getUser(Long userId) {
      User user = userDao.findUserById(userId);
      if (user == null) {
         throw new EntityNotFoundException("Did not find user for transaction");
      }
      return user;
   }
}
