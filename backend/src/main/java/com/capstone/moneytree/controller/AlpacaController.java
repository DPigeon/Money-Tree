package com.capstone.moneytree.controller;

import com.capstone.moneytree.facade.MarketInteractionsFacade;
import net.jacobpeterson.domain.alpaca.account.Account;
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory;
import net.jacobpeterson.domain.alpaca.position.Position;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/alpaca")
public class AlpacaController extends ApiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockController.class);
    private final MarketInteractionsFacade marketInteractionsFacade;

    @Autowired
    public AlpacaController(MarketInteractionsFacade marketInteractionsFacade) {
        this.marketInteractionsFacade = marketInteractionsFacade;
    }

    /**
     * Get an Alpaca account endpoint.
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
     * @return ResponseEntity of Position List.
     */
    @GetMapping("/positions")
    public ResponseEntity<ArrayList<Position>> getPositions() {
        ArrayList<Position> positions = marketInteractionsFacade.getOpenPositions();
        Optional<ArrayList<Position>> optional = Optional.of(positions);

        return ResponseEntity.of(optional);
    }

    /**
     * Get a Portfolio timeseries endpoint.
     * Endpoint example: api/alpaca/portfolio/period=1&unit=WEEK&timeframe=FIFTEEN_MINUTE&dateend=2007-12-03&extended=false
     * @param periodLength Period needed for the timeseries
     * @param periodUnit Either day (D), week (W), month (M) or year (A).
     * @param timeFrame Resolution of the time window (1Min, 5Min, 15Min, 1H, 1D)
     * @param dateEnd Date data is returned up to.
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
        if (validatePositiveInt(periodLength) && validateString(periodUnit) && validateString(timeFrame) && dateEnd != null && validateString(extendedHours)) {
            PortfolioHistory portfolioHistory = marketInteractionsFacade.getPortfolioHistory(
                    periodLength,
                    periodUnit,
                    timeFrame,
                    dateEnd,
                    Boolean.parseBoolean(extendedHours));

            return ResponseEntity.ok(portfolioHistory);
        } else {
            return ResponseEntity.of(Optional.empty()); // TODO: Error Handling in another story using Optionals
        }
    }

    // TODO: move these methods into a validation class later?
    public static boolean validatePositiveInt(int number) {
        boolean valid = false;
        try {
            if (number > 0) {
                valid = true;
            }
            Integer.valueOf(number);
        } catch (NumberFormatException e) {
            valid = false;
        }

        return valid;
    }

    public static boolean validateString(String string) {
        boolean valid = false;
        if (string != null && !string.isEmpty()) {
            valid = true;
        }

        return valid;
    }
}