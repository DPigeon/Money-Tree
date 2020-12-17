package com.capstone.moneytree.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.capstone.moneytree.facade.MarketInteractionsFacade;

import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;

@MoneyTreeController
@RequestMapping("/alpaca")
public class AlpacaController {

   private final MarketInteractionsFacade marketInteractionsFacade;

   @Autowired
   public AlpacaController(MarketInteractionsFacade marketInteractionsFacade) {
      this.marketInteractionsFacade = marketInteractionsFacade;
   }

   /**
    * Get an Alpaca account endpoint.
    *
    * @return ResponseEntity of Account.
    */
   @GetMapping("/account")
   public ResponseEntity<Account> getAccount() {
      Account account = marketInteractionsFacade.getAccount();
      Optional<Account> optional = Optional.of(account);

      return ResponseEntity.of(optional);
   }

   /**
    * Get the positions of the Alpaca account endpoint.
    *
    * @return ResponseEntity of Position List.
    */
   @GetMapping("/positions")
   public ResponseEntity<List<Position>> getPositions() {
      List<Position> positions = marketInteractionsFacade.getOpenPositions();
      Optional<List<Position>> optional = Optional.of(positions);

      return ResponseEntity.of(optional);
   }

   /**
    * Get a Portfolio timeseries endpoint.
    * Endpoint example: api/alpaca/portfolio/period=1&unit=WEEK&timeframe=FIFTEEN_MINUTE&dateend=2007-12-03&extended=false
    *
    * @param periodLength  Period needed for the timeseries
    * @param periodUnit    Either day (D), week (W), month (M) or year (A).
    * @param timeFrame     Resolution of the time window (1Min, 5Min, 15Min, 1H, 1D)
    * @param dateEnd       Date data is returned up to.
    * @param extendedHours Includes extended hours in result. Works only for timeframe less than 1D.
    * @return A PortfolioHistory of timeseries
    */
   @GetMapping("/portfolio/period={periodLength}&unit={periodUnit}&timeframe={timeFrame}&dateend={dateEnd}&extended={extendedHours}")
   public ResponseEntity<PortfolioHistory> getPortfolio(
           @PathVariable(name = "periodLength") @Valid @NotBlank int periodLength,
           @PathVariable(name = "periodUnit") @Valid @NotBlank String periodUnit,
           @PathVariable(name = "timeFrame") @Valid @NotBlank String timeFrame,
           @PathVariable(name = "dateEnd") @Valid @NotBlank LocalDate dateEnd,
           @PathVariable(name = "extendedHours") @Valid @NotBlank String extendedHours) {
      PortfolioHistory portfolioHistory = marketInteractionsFacade.getPortfolioHistory(
              periodLength,
              periodUnit,
              timeFrame,
              dateEnd,
              Boolean.parseBoolean(extendedHours));

      return ResponseEntity.ok(portfolioHistory);
   }
}