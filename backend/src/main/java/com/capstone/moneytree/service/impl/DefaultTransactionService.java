package com.capstone.moneytree.service.impl;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.http.HttpClient;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;


import com.capstone.moneytree.model.AlpacaOAuthResponse;
import com.capstone.moneytree.model.AlpacaOrderResponse;
import com.google.gson.Gson;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.domain.alpaca.order.Order;

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
      /* Get user for that transaction*/
      User user = getUser(Long.parseLong(userId));

      String alpacaKey = user.getAlpacaApiKey();

      CloseableHttpClient httpClient = HttpClients.createDefault();
      HttpPost httpPost = new HttpPost(alpacaPaperApiUrl + "/v2/orders");
      httpPost.addHeader("Authorization", "Bearer " + alpacaKey);

      /* Execute order via HTTP POST request to alpaca paper endpoint */
      AlpacaOrderResponse alpacaOrderResponse = null;
      try {
         StringEntity params = new StringEntity(
             "{\"symbol\":\"" + order.getSymbol() + "\"," +
             "\"qty\":" + order.getQty() + "," +
             "\"side\":\"" + order.getSide() + "\"," +
             "\"type\":\"" + order.getType() + "\"," +
             "\"time_in_force\":\"day\"" +
             "}"
         );
         params.setContentType("application/json");
         httpPost.setEntity(params);

         HttpResponse response = httpClient.execute(httpPost);

         //parse json response using gson
         Gson gson = new Gson();
         alpacaOrderResponse = gson.fromJson(EntityUtils.toString(response.getEntity()), AlpacaOrderResponse.class);
         LOG.info("Alpaca order ({}) successfully placed {}:{}", alpacaOrderResponse.getClientOrderId(), alpacaOrderResponse.getSymbol(), + alpacaOrderResponse.getQty());

      } catch (IOException e) {
         e.printStackTrace();
      }

      /* Build the transaction and persist */
      Transaction transaction = null;
      try {
         AlpacaAPI api = AlpacaSession.alpaca(alpacaKey);
         transaction = Transaction.builder()
              .status(TransactionStatus.PENDING)
              .purchasedAt(ZonedDateTime.parse(alpacaOrderResponse.getCreatedAt()))
              .quantity(alpacaOrderResponse.getQty())
              .fulfilledStocks(List.of(Stock.builder().asset(api.getAssetBySymbol(alpacaOrderResponse.getSymbol())).build())) // populate the stock which this transaction fulfills. Only asset field is populated now
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
         userDao.save(user);
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
