package com.capstone.moneytree.service.impl;

import java.util.List;

import net.jacobpeterson.domain.alpaca.accountconfiguration.AccountConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.TransactionDao;
import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.exception.AlpacaException;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.facade.AlpacaSession;
import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.enums.OrderSide;
import net.jacobpeterson.alpaca.enums.OrderTimeInForce;
import net.jacobpeterson.alpaca.enums.OrderType;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.domain.alpaca.order.Order;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {
   private static final Logger LOGGER = LoggerFactory.getLogger(DefaultTransactionService.class);

   private final TransactionDao transactionDao;
   private final UserDao userDao;

   @Autowired
   public DefaultTransactionService(TransactionDao transactionDao, UserDao userDao) {
      this.transactionDao = transactionDao;
      this.userDao = userDao;
   }

   @Override
   public List<Transaction> getAllTransactions() {
      LOGGER.info("Getting all transactions...");
      return transactionDao.findAll();
   }

   @Override
   public Transaction getTransactionByOrderType(MoneyTreeOrderType moneyTreeOrderType) {
      return null;
   }

   @Override
   public Transaction execute(String userId, Order order) {
      /* Get user for that transaction*/
      User user = getUser(Long.parseLong(userId));

      String alpacaKey = user.getAlpacaApiKey();
      //AlpacaAPI api = new AlpacaAPI("PKZVEATJSRHXR2AY4UWB", "LzIPiJmjAXju9DVuuRa9gBQcCXQwl9IrN5CfhloZ");
      AlpacaAPI api = AlpacaSession.alpaca(alpacaKey);

      /* Place the order to alpaca api */
      Order placedOrder;
      Transaction transaction;
      try {
         System.out.println("Buying Power: " + api.getAccount().getBuyingPower());
         placedOrder = api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY);
         //placedOrder = api.requestNewOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderType.valueOf(order.getType().toUpperCase()), OrderTimeInForce.DAY, null, null, null, null, null, null, null, null, null, null);
         LOGGER.info("Placed order {}", placedOrder.getClientOrderId());

         /* Build the transaction and persist */
         transaction = Transaction.builder()
                 .status(TransactionStatus.PENDING)
                 .purchasedAt(placedOrder.getCreatedAt())
                 .quantity(Float.parseFloat(placedOrder.getQty()))
                 .fulfilledStocks(List.of(Stock.builder().asset(api.getAssetBySymbol(placedOrder.getSymbol())).build())) // populate the stock which this transaction fulfills. Only asset field is populated now
                 .build();

         /* Save the user with by appending new transaction */
         List<Transaction> transactions = new java.util.ArrayList<>(List.of(transaction));
         if (user.getTransactions() != null)
            transactions.addAll(user.getTransactions());
         user.setTransactions(transactions);
         userDao.save(user);

      } catch (AlpacaAPIRequestException ex) {
         throw new AlpacaException(ex.getMessage());
      }
      return transaction;
   }

   private User getUser(Long userId) {
      User user = userDao.findUserById(userId);
      if (user == null) {
         throw new EntityNotFoundException("Did not find user for transaction");
      }
      return user;
   }
}
