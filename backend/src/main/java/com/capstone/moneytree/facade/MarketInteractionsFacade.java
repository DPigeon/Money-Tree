package com.capstone.moneytree.facade;


import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.dao.TransactionDao;
import com.capstone.moneytree.exception.AlpacaClockException;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.handler.ExceptionMessage;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import net.jacobpeterson.abstracts.websocket.exception.WebsocketException;
import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.enums.PortfolioPeriodUnit;
import net.jacobpeterson.alpaca.enums.PortfolioTimeFrame;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.alpaca.websocket.broker.listener.AlpacaStreamListener;
import net.jacobpeterson.alpaca.websocket.broker.listener.AlpacaStreamListenerAdapter;
import net.jacobpeterson.alpaca.websocket.broker.message.AlpacaStreamMessageType;
import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.clock.Clock;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;
import net.jacobpeterson.domain.alpaca.streaming.AlpacaStreamMessage;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdateMessage;

/**
 * This facade abstracts the Alpaca API and exposes only the relevant methods
 * for MoneyTree.
 */
@Component
public class MarketInteractionsFacade {

   private static final Logger LOGGER = LoggerFactory.getLogger(MarketInteractionsFacade.class);

   private final UserDao userDao;
   private AlpacaAPI alpacaAPI;
   private final Map<String, AlpacaStreamListener> userIdToStream;

   @Autowired
   TransactionDao transactionDao;

   @Autowired
   public MarketInteractionsFacade(UserDao userDao) {
      this.userDao = userDao;
      userIdToStream = new HashMap<>();
   }

   private void initializeAlpacaSession(String userId) {
      User user = getUser(Long.parseLong(userId));
      String alpacaKey = user.getAlpacaApiKey();
      AlpacaSession alpacaSession = new AlpacaSession();
      alpacaAPI = alpacaSession.alpaca(alpacaKey);
   }

   /**
    * Gets the Alpaca user account.
    * 
    * @return An Account.
    */
   public Account getAccount(String userId) {
      initializeAlpacaSession(userId);
      Account account = null;
      try {
         account = alpacaAPI.getAccount();
         LOGGER.info("Get account: {}", account);
      } catch (AlpacaAPIRequestException e) {
         LOGGER.error("Error getting the Alpaca account: {}", e.getMessage());
      }

      return account;
   }

   /**
    * Gets the market status (open/closed).
    * 
    * @return market status.
    */
   public Clock getMarketClock(String userId) {
      initializeAlpacaSession(userId);
      Clock marketClock;
      try {
         marketClock = alpacaAPI.getClock();
         LOGGER.info("Get market clock: {}", marketClock);
      } catch (Exception e) {
         LOGGER.error("Error getting the Alpaca market clock: {}", e.getMessage());
         throw new AlpacaClockException(ExceptionMessage.ALPACA_CLOCK_ERROR.getMessage());
      }
      return marketClock;
   }

   /**
    * Gets all stocks position for a user.
    * 
    * @return List of available positions.
    */
   public List<Position> getOpenPositions(String userId) {
      initializeAlpacaSession(userId);
      ArrayList<Position> positions = null;
      try {
         positions = alpacaAPI.getOpenPositions();
         LOGGER.info("Get positions: {}", positions);
      } catch (AlpacaAPIRequestException e) {
         LOGGER.error("Error getting positions: {}", e.getMessage());
      }

      return positions;
   }

   /**
    * Gets the timeseries data for the profile value of equity and profit loss.
    * 
    * @param periodLength  Duration of the data.
    * @param periodUnit    Either day (D), week (W), month (M) or year (A).
    * @param timeFrame     Resolution of the time window (1Min, 5Min, 15Min, 1H,
    *                      1D)
    * @param dateEnd       Date data is returned up to.
    * @param extendedHours Includes extended hours in result. Works only for
    *                      timeframe less than 1D.
    * @return A PortfolioHistory of timeseries
    */
   public PortfolioHistory getPortfolioHistory(String userId, @NotNull @NotBlank int periodLength,
         @NotNull @NotBlank String periodUnit, @NotNull @NotBlank String timeFrame,
         @NotNull @NotBlank LocalDate dateEnd, @NotNull @NotBlank boolean extendedHours) {
      initializeAlpacaSession(userId);
      PortfolioHistory portfolioHistory = null;
      PortfolioPeriodUnit portfolioPeriodUnit = PortfolioPeriodUnit.valueOf(periodUnit);
      PortfolioTimeFrame portfolioTimeFrame = PortfolioTimeFrame.valueOf(timeFrame);
      try {
         portfolioHistory = alpacaAPI.getPortfolioHistory(periodLength, portfolioPeriodUnit, portfolioTimeFrame,
               dateEnd, extendedHours);
         LOGGER.info("Get portfolio: {}", portfolioHistory);
      } catch (AlpacaAPIRequestException e) {
         LOGGER.error("Error getting the portfolio: {}", e.getMessage());
      }

      return portfolioHistory;
   }

   /**
    * A stream listener to receive trade updates
    * https://alpaca.markets/docs/api-documentation/api-v2/streaming/
    */
   public void listenToStreamUpdates(String userId, SimpMessagingTemplate messageSender) {
      try {
         initializeAlpacaSession(userId);
         AlpacaStreamListener streamListener = createStreamListener(userId, messageSender,
               AlpacaStreamMessageType.TRADE_UPDATES);
         alpacaAPI.addAlpacaStreamListener(streamListener);
         if (userIdToStream.containsKey(userId)) {
            userIdToStream.replace(userId, streamListener);
         } else {
            userIdToStream.put(userId, streamListener);
         }
         LOGGER.info("[Trade Updates]: Listening to trade streams of user ID {}", userId);
      } catch (WebsocketException e) {
         LOGGER.error("WebSocketException for user ID {}. Error: {}", userId, e.getMessage());
      }
   }

   public void disconnectFromStream(String userId) {
      initializeAlpacaSession(userId);
      if (userIdToStream.containsKey(userId)) {
         AlpacaStreamListener streamListener = userIdToStream.get(userId);
         try {
            alpacaAPI.removeAlpacaStreamListener(streamListener);
            userIdToStream.remove(userId);
            LOGGER.info("[Trade Updates]: Removing stream listener for user ID {}", userId);
         } catch (WebsocketException e) {
            LOGGER.error("WebSocketException for user ID {}", userId);
         }
      }
   }

   /**
    * Creates a streamListenerAdapter for stream listeners
    * 
    * @param messageType A list of AlpacaStreamMessageType
    * @return An AlpacaStreamListenerAdapter
    */
   private AlpacaStreamListener createStreamListener(String userId, SimpMessagingTemplate messageSender,
         AlpacaStreamMessageType... messageType) {
      return new AlpacaStreamListenerAdapter(messageType) {
         @Override
         public void onStreamUpdate(AlpacaStreamMessageType streamMessageType, AlpacaStreamMessage streamMessage) {
            if (streamMessageType == AlpacaStreamMessageType.TRADE_UPDATES) {
               TradeUpdateMessage tradeMessage = (TradeUpdateMessage) streamMessage;
               TradeUpdate tradeUpdate = tradeMessage.getData();
               if (tradeUpdate.getEvent().equals("fill")) {
                  messageSender.convertAndSend("/queue/user-" + userId, tradeUpdate.getOrder());
                  sendOrderCompletedEmail(userId, tradeUpdate);
                  updateTransactionStatus(tradeUpdate.getOrder().getClientOrderId());
                  LOGGER.info("Order filled by user id {}", userId);
               }
            }
         }
      };
   }

   // Refactor to different service. Add the relationship where user now owns the stock of a
   // transaction that has been fulfilled
   private void updateTransactionStatus(String clientOrderId) {
      List<Transaction> transactions = transactionDao.findAll();
      transactions.stream()
              .filter(transaction -> transaction.getClientOrderId().equals(clientOrderId))
              .findFirst()
              .ifPresent(this::changeStatusAndSave);
      LOGGER.info("Updated transaction status for transaction {}", clientOrderId);
   }

   private void changeStatusAndSave(Transaction transaction) {
      transaction.setStatus(TransactionStatus.COMPLETED);
      transactionDao.save(transaction);
   }

   private void sendOrderCompletedEmail(String userId, TradeUpdate trade) {
      EmailSender emailSender = new EmailSender();
      User user = getUser(Long.parseLong(userId));
      emailSender.sendOrderCompletedEmail(user, trade);
   }

   private User getUser(Long userId) {
      User user = userDao.findUserById(userId);
      if (user == null) {
         throw new EntityNotFoundException("User does not exist!");
      }

      return user;
   }
}
