package com.capstone.moneytree.service.impl;


import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


import com.capstone.moneytree.exception.AlpacaException;
import com.capstone.moneytree.model.AlpacaOrder;
import com.google.gson.Gson;
import net.jacobpeterson.alpaca.enums.OrderSide;
import net.jacobpeterson.alpaca.enums.OrderTimeInForce;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.joda.time.format.ISODateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import javax.ws.rs.ForbiddenException;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {
   private static final Logger LOGGER = LoggerFactory.getLogger(DefaultTransactionService.class);

   private final TransactionDao transactionDao;
   private final UserDao userDao;
   @Value("${alpaca.base.api.url}")
   private String alpacaPaperApiUrl;


   private static final Logger LOG = LoggerFactory.getLogger(DefaultTransactionService.class);


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
      LOG.error("Inside the service now ....");

      /* Get user for that transaction*/
      User user = getUser(Long.parseLong(userId));

      LOG.error("Got the user from DB!");


      String alpacaKey = user.getAlpacaApiKey();

      /* Build the transaction and persist */
      Transaction transaction = null;
      try {
         LOG.error("Getting the alpaca api suing alpacaey {}", alpacaKey);
         AlpacaAPI api = AlpacaSession.alpaca(alpacaKey);
         LOG.error("Got alpaca client!!! succesfully");

         LOG.error("Making the alpaca request");
         Order alpacaOrder = api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()), OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY);
         LOG.error("Executed the alpaca request");

         System.out.println(alpacaOrder.getClientOrderId());

         transaction = Transaction.builder()
                 .status(TransactionStatus.PENDING)
                 .purchasedAt(alpacaOrder.getCreatedAt())
                 .clientOrderId(alpacaOrder.getClientOrderId())
                 .moneyTreeOrderType(MoneyTreeOrderType.valueOf(alpacaOrder.getType().toUpperCase()+"_"+alpacaOrder.getSide().toUpperCase()))
                 .quantity(Float.parseFloat(alpacaOrder.getQty()))
                 .fulfilledStocks(List.of(Stock.builder().asset(api.getAssetBySymbol(alpacaOrder.getSymbol())).build())) // populate the stock which this transaction fulfills. Only asset field is populated now
                 .build();
      } catch (AlpacaAPIRequestException e) {
         e.printStackTrace();
      }

      /* Save the user by appending new transaction */
      if (transaction != null) {
         List<Transaction> transactions = new ArrayList<>(List.of(transaction));
         if (user.getTransactions() != null)
            transactions.addAll(user.getTransactions());
         user.setTransactions(transactions);
         LOG.error("Saving the transaction");

         userDao.save(user);

         LOG.error(" transaction saved");

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
