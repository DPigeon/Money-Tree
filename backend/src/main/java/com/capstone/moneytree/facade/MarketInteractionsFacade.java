package com.capstone.moneytree.facade;

import com.capstone.moneytree.model.node.User;
import net.jacobpeterson.abstracts.websocket.exception.WebsocketException;
import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.enums.PortfolioPeriodUnit;
import net.jacobpeterson.alpaca.enums.PortfolioTimeFrame;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.alpaca.websocket.broker.listener.AlpacaStreamListenerAdapter;
import net.jacobpeterson.alpaca.websocket.broker.message.AlpacaStreamMessageType;
import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;
import net.jacobpeterson.domain.alpaca.streaming.AlpacaStreamMessage;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdateMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * This facade abstracts the Alpaca API and exposes only the relevant
 * methods for MoneyTree.
 * */

@Component
public class MarketInteractionsFacade {

   private static final Logger LOGGER = LoggerFactory.getLogger(MarketInteractionsFacade.class);
   private final AlpacaAPI alpacaAPI;

   @Autowired
   private SimpMessagingTemplate simpMessaging;

   @Autowired
   public MarketInteractionsFacade(@Value("${alpaca.api.version}") String apiVersion,
                                   @Value("${alpaca.key.id}") String keyId,
                                   @Value("${alpaca.secret}") String secretKey,
                                   @Value("${alpaca.base.api.url}") String baseApiUrl,
                                   @Value("${alpaca.base.data.url}") String baseDataUrl) {
      alpacaAPI = new AlpacaAPI(apiVersion, keyId, secretKey, baseApiUrl, baseDataUrl);
   }

   /**
    * Gets the Alpaca user account.
    * @return An Account.
    */
   public Account getAccount() {
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
    * Gets all stocks position for a user.
    * @return List of available positions.
    */
   public List<Position> getOpenPositions() {
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
    * @param periodLength Duration of the data.
    * @param periodUnit Either day (D), week (W), month (M) or year (A).
    * @param timeFrame Resolution of the time window (1Min, 5Min, 15Min, 1H, 1D)
    * @param dateEnd Date data is returned up to.
    * @param extendedHours Includes extended hours in result. Works only for timeframe less than 1D.
    * @return A PortfolioHistory of timeseries
    */
   public PortfolioHistory getPortfolioHistory(@NotNull @NotBlank int periodLength,
                                               @NotNull @NotBlank String periodUnit,
                                               @NotNull @NotBlank String timeFrame,
                                               @NotNull @NotBlank LocalDate dateEnd,
                                               @NotNull @NotBlank boolean extendedHours) {
      PortfolioHistory portfolioHistory = null;
      PortfolioPeriodUnit portfolioPeriodUnit = PortfolioPeriodUnit.valueOf(periodUnit);
      PortfolioTimeFrame portfolioTimeFrame = PortfolioTimeFrame.valueOf(timeFrame);
      try {
         portfolioHistory = alpacaAPI.getPortfolioHistory(
                 periodLength,
                 portfolioPeriodUnit,
                 portfolioTimeFrame,
                 dateEnd,
                 extendedHours);
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
   public void listenToTradeUpdates(User user) {
      try {
         AlpacaStreamListenerAdapter tradeListener = createStreamListenerAdapter(user, AlpacaStreamMessageType.TRADE_UPDATES);
         alpacaAPI.addAlpacaStreamListener(tradeListener);
      } catch (WebsocketException e) {
         e.printStackTrace();
      }
   }

   /**
    * Creates a streamListenerAdapter for stream listeners
    * @param messageType A list of AlpacaStreamMessageType
    * @return An AlpacaStreamListenerAdapter
    */
   private AlpacaStreamListenerAdapter createStreamListenerAdapter(User user, AlpacaStreamMessageType... messageType) {
      return new AlpacaStreamListenerAdapter(messageType) {
         @Override
         public void onStreamUpdate(AlpacaStreamMessageType streamMessageType, AlpacaStreamMessage streamMessage) {
            if (streamMessageType == AlpacaStreamMessageType.TRADE_UPDATES) {
               TradeUpdateMessage tradeMessage = (TradeUpdateMessage) streamMessage;
               TradeUpdate tradeUpdate = tradeMessage.getData();
               if (tradeUpdate.getEvent().equals("fill")) {
                  simpMessaging.convertAndSendToUser(
                          user.getUsername(),
                          "/secured/user/queue/specific-user",
                          tradeUpdate.getOrder().getClientOrderId());
               }
            }
         }
      };
   }
}
