package com.capstone.moneytree.facade;

import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.alpaca.enums.PortfolioPeriodUnit;
import net.jacobpeterson.alpaca.enums.PortfolioTimeFrame;
import net.jacobpeterson.alpaca.rest.exception.AlpacaAPIRequestException;
import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;

/**
 * This facade abstracts the Alpaca API and exposes only the relevant
 * methods for MoneyTree.
 * */

@Component
public class MarketInteractionsFacade {

   private static final Logger LOGGER = LoggerFactory.getLogger(MarketInteractionsFacade.class);
   private final AlpacaAPI alpacaAPI;

   public MarketInteractionsFacade() {
      alpacaAPI = new AlpacaAPI();
   }

   /**
    * Gets the Alpaca user account.
    * @return An Account.
    */
   public Account getAccount() {
      Account account = null;
      try {
         account = alpacaAPI.getAccount();
         LOGGER.info("Get account: {}", toString().replace(",", ",\n\t"));
      } catch (AlpacaAPIRequestException e) {
         e.printStackTrace();
      }

      return account;
   }

   /**
    * Gets all stocks position for a user.
    * @return List of available positions.
    */
   public ArrayList<Position> getOpenPositions() {
      ArrayList<Position> positions = null;
      try {
         positions = alpacaAPI.getOpenPositions();
      } catch (AlpacaAPIRequestException e) {
         e.printStackTrace();
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
      } catch (AlpacaAPIRequestException e) {
         e.printStackTrace();
      }

      return portfolioHistory;
   }
}
