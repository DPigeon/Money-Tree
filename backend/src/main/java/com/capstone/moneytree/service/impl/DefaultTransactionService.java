package com.capstone.moneytree.service.impl;

import static com.capstone.moneytree.handler.ExceptionMessage.ORDER_ERROR;

import java.util.ArrayList;
import java.util.List;

import com.capstone.moneytree.dao.*;
import com.capstone.moneytree.exception.AlpacaException;

import com.capstone.moneytree.exception.BadRequestException;
import com.capstone.moneytree.exception.EntityNotFoundException;
import net.jacobpeterson.alpaca.enums.OrderSide;
import net.jacobpeterson.alpaca.enums.OrderTimeInForce;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.facade.AlpacaSession;
import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.model.relationship.ToFulfill;
import com.capstone.moneytree.model.relationship.Made;
import com.capstone.moneytree.service.api.StockMarketDataService;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.domain.alpaca.order.Order;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {
   private static final Logger LOGGER = LoggerFactory.getLogger(DefaultTransactionService.class);

   private final TransactionDao transactionDao;
   private final UserDao userDao;
   private final StockDao stockDao;
   private final MadeDao madeDao;
   private final ToFulfillDao toFulfillDao;
   private final AlpacaSession session;
   private final StockMarketDataService stockMarketDataService;

   @Autowired
   public DefaultTransactionService(TransactionDao transactionDao, UserDao userDao, StockDao stockDao, MadeDao madeDao,
                                    ToFulfillDao toFulfillDao, AlpacaSession session, StockMarketDataService stockMarketDataService) {
      this.transactionDao = transactionDao;
      this.userDao = userDao;
      this.stockDao = stockDao;
      this.madeDao = madeDao;
      this.toFulfillDao = toFulfillDao;
      this.session = session;
      this.stockMarketDataService = stockMarketDataService;
   }

   @Override
   public List<Transaction> getAllTransactions() {
      LOGGER.info("Getting all transactions...");
      return transactionDao.findAll();
   }

   @Override
   public List<Transaction> getTransactionsByOrderType(MoneyTreeOrderType moneyTreeOrderType) {
      return transactionDao.findByMoneyTreeOrderType(moneyTreeOrderType);
   }

   @Override
   public List<Transaction> execute(String userId, Order order) {

      /* Get user for that transaction */
      User user = userDao.findUserById(Long.parseLong(userId));
      if (user == null) {
         throw new EntityNotFoundException("User does not exist!");
      }
      String alpacaKey = user.getAlpacaApiKey();

      /* Build the transaction and persist and update user balance */
      executeTransaction(alpacaKey, order, user);
      userDao.save(user);

      return getUserTransactions(user.getId());
   }

   private void executeTransaction(String alpacaKey, Order order, User user) {
      Transaction transaction;
      try {
         AlpacaAPI api = session.alpaca(alpacaKey);

         Order alpacaOrder = executeRequest(api, order);

         Stock stock = stockDao.findBySymbol(order.getSymbol());
         if (stock == null) { // if database does not have this stock object create and save it
            KeyStats stockInfo = stockMarketDataService.getKeyStats(order.getSymbol());
            stock = Stock.builder()
                    .symbol(order.getSymbol())
                    .companyName(stockInfo.getCompanyName())
                    .build();
            stockDao.save(stock);
         }

         assert alpacaOrder != null;
         LOGGER.info("Executed order {}", alpacaOrder.getClientOrderId());

         transaction = constructTransactionFromOrder(alpacaOrder);
         updateUserScore(order, user, transaction);
         transactionDao.save(transaction);

         /*
          * create and save two relationships: Made and ToFulfill. User Made Transaction
          * and Transaction ToFulfill Stock. The fulfillmentDate will be set when the
          * order is completed (fulfilled), and similarly the OWNS relationships will be
          * created when the order is completed
          */

         Made madeRelationship = new Made(user, transaction, transaction.getPurchasedAt());
         madeDao.save(madeRelationship);

         ToFulfill toFulfillRelationship = new ToFulfill(transaction, stock, null);
         toFulfillDao.save(toFulfillRelationship);

         user.setBalance(Float.parseFloat(api.getAccount().getCash()));
      } catch (Exception e) {
         throw new AlpacaException(e.getMessage());
      }
   }

   private Order executeRequest(AlpacaAPI api, Order order) throws AlpacaAPIRequestException {
      if (MoneyTreeOrderType.MARKET_BUY.name().equals(obtainMoneyTreeOrderType(order).name()) ||
              MoneyTreeOrderType.MARKET_SELL.name().equals(obtainMoneyTreeOrderType(order).name())) {
         return api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                 OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY);
      }
      else if (MoneyTreeOrderType.LIMIT_BUY.name().equals(obtainMoneyTreeOrderType(order).name()) ||
              MoneyTreeOrderType.LIMIT_SELL.name().equals(obtainMoneyTreeOrderType(order).name())) {
         return api.requestNewLimitOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                 OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY, Double.valueOf(order.getLimitPrice()), order.getExtendedHours());
      }
      throw new BadRequestException(ORDER_ERROR.getMessage());
   }

   private Transaction constructTransactionFromOrder(Order alpacaOrder) {
      return Transaction.builder()
              .status(TransactionStatus.PENDING)
              .purchasedAt(alpacaOrder.getCreatedAt())
              .clientOrderId(alpacaOrder.getClientOrderId())
              .moneyTreeOrderType(MoneyTreeOrderType
                      .valueOf(alpacaOrder.getType().toUpperCase() + "_" + alpacaOrder.getSide().toUpperCase()))
              .quantity(Float.parseFloat(alpacaOrder.getQty())).purchasedAt(alpacaOrder.getSubmittedAt())
              .symbol(alpacaOrder.getSymbol())
              .build(); // avg price and total will be set only if stock got fulfilled
   }

   // ISSUE-346
   public void updateUserScore(Order order, User user, Transaction transaction) {
      // Formula: sum(price * qty)/sum(qty)
      if (order.getSide().equals("sell")) {
         float sumQtyPrice = 0;
         float sumQty = 0;
         List<Made> userMade = madeDao.findByUserId(user.getId());
         for (Made made : userMade) {
            Transaction otherTransaction = made.getTransaction();
            if (otherTransaction.getSymbol().equals(transaction.getSymbol())) {
               sumQtyPrice = sumQtyPrice + otherTransaction.getTotal() * otherTransaction.getQuantity();
               sumQty = sumQty + otherTransaction.getQuantity();
            }
         }

         if (sumQty != 0) {
            calculateScoreAndUpdate(sumQtyPrice, sumQty, transaction, user);
         } else {
            throw new EntityNotFoundException("Transaction not found while selling stock!");
         }
      }
   }

   private void calculateScoreAndUpdate(float sumQtyPrice, float sumQty, Transaction transaction, User user) {
      int roundedBoughtPrice = Math.round(sumQtyPrice / sumQty);
      float soldPrice = transaction.getTotal();
      if (roundedBoughtPrice == soldPrice) {
         return; // No need to update score if prices are the same
      }
      double score = soldPrice - roundedBoughtPrice;
      double updatedScore = user.getScore() + score;
      user.setScore(updatedScore);
      userDao.save(user);
   }
   private MoneyTreeOrderType obtainMoneyTreeOrderType(Order order) {
      return MoneyTreeOrderType.valueOf(order.getType().toUpperCase() + "_" + order.getSide().toUpperCase());
   }

   @Override
   public List<Transaction> getUserTransactions(Long userId) {
      List<Made> allMadeRels = madeDao.findByUserId(userId);
      List<Transaction> userTransactions = new ArrayList<>();
      for (Made rel : allMadeRels) {
         userTransactions.add(rel.getTransaction());
      }
      return userTransactions;
   }
}
