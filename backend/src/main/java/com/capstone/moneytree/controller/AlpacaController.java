package com.capstone.moneytree.controller;

import java.time.LocalDate;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.capstone.moneytree.facade.MarketInteractionsFacade;

import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.clock.Clock;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;

@MoneyTreeController
@RequestMapping("/alpaca")
public class AlpacaController {

    private final MarketInteractionsFacade marketInteractionsFacade;

    private final SimpMessagingTemplate messageSender;

    @Autowired
    public AlpacaController(MarketInteractionsFacade marketInteractionsFacade, SimpMessagingTemplate messageSender) {
        this.marketInteractionsFacade = marketInteractionsFacade;
        this.messageSender = messageSender;
    }

    /**
     * Get an Alpaca account endpoint.
     *
     * @return ResponseEntity of Account.
     */
    @GetMapping("/account")
    public ResponseEntity<Account> getAccount(String userId) {
        Account account = marketInteractionsFacade.getAccount(userId);

        return ResponseEntity.ok(account);
    }

    /**
     * Get the positions of the Alpaca account endpoint.
     *
     * @return ResponseEntity of Position List.
     */
    @GetMapping("/positions")
    public ResponseEntity<List<Position>> getPositions(String userId) {
        List<Position> positions = marketInteractionsFacade.getOpenPositions(userId);

        return ResponseEntity.ok(positions);
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
            @PathVariable(name = "userId") @Valid @NotBlank String userId,
            @PathVariable(name = "periodLength") @Valid @NotBlank int periodLength,
            @PathVariable(name = "periodUnit") @Valid @NotBlank String periodUnit,
            @PathVariable(name = "timeFrame") @Valid @NotBlank String timeFrame,
            @PathVariable(name = "dateEnd") @Valid @NotBlank LocalDate dateEnd,
            @PathVariable(name = "extendedHours") @Valid @NotBlank String extendedHours) {
        PortfolioHistory portfolioHistory = marketInteractionsFacade.getPortfolioHistory(
                userId,
                periodLength,
                periodUnit,
                timeFrame,
                dateEnd,
                Boolean.parseBoolean(extendedHours));

        return ResponseEntity.ok(portfolioHistory);
    }

    /**
     * 1. To make a WS request, you must use a STOMP client with SockJS
     * 2. Endpoint to connect is "http://localhost:8080/api/v1/ws"
     * 3. Subscribe to the "/queue/user-{userId}" channel
     * 4. Send a message to "/app/trade/updates" with content "{userId}" to receive trade updates on the user's alpaca account
     * 5. Send a message to "/app/trade/disconnect" with content "{userId}" to disconnect from stream
     *
     * @param userId The user ID
     */
    @MessageMapping("/trade/updates")
    public void registerToTradeUpdates(String userId) {
        marketInteractionsFacade.listenToStreamUpdates(userId, messageSender);
    }

    @MessageMapping("/trade/disconnect")
    public void disconnectFromTradeUpdates(String userId) {
        marketInteractionsFacade.disconnectFromStream(userId);
    }

    /**
     * Gets the market status (open/closed).
     *
     * @return market status.
     */
    @GetMapping("/market-status/{userId}")
    public ResponseEntity<Clock> getMarketClock(@PathVariable(name = "userId") @Valid @NotBlank String userId) {
        Clock marketClock = marketInteractionsFacade.getMarketClock(userId);
        return ResponseEntity.ok(marketClock);
    }
}

