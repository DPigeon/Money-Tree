package com.capstone.moneytree.controller

import com.capstone.moneytree.facade.MarketInteractionsFacade
import net.jacobpeterson.domain.alpaca.account.Account
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory
import net.jacobpeterson.domain.alpaca.position.Position
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import spock.lang.Shared
import spock.lang.Specification

import java.time.LocalDate

/**
 * Integration Tests for the Alpaca Controller. Tests the MarketInteractionFacade as well.
 */

@SpringBootTest
class AlpacaControllerIntegrationTest extends Specification {

    // TODO: Replace this later
    private static final String apiVersion = "v2"
    private static final String keyId = "PKZJK3IXQ4JZAWCBDSRX"
    private static final String secret = "SA5sYIYR58AukN8NKpdGkQZSCvOCoTXYgyjuaoUe"
    private static final String baseApiUrl = "https://paper-api.alpaca.markets"
    private static final String baseDataUrl = "https://data.alpaca.markets"

    @Shared
    def alpacaController

    @Shared
    def marketInteractionsFacade;

    def setupSpec() {
        marketInteractionsFacade = new MarketInteractionsFacade(apiVersion, keyId, secret, baseApiUrl, baseDataUrl)
        alpacaController = new AlpacaController(marketInteractionsFacade)
    }

    @Test
    def "Should retrieve an Alpaca account successfully"() {
        when: "Getting an Alpaca account"
        ResponseEntity<Account> response = alpacaController.getAccount();

        then: "The account should be retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    @Test
    def "Should retrieve a list of positions successfully"() {
        when: "Getting a list of positions"
        ResponseEntity<ArrayList<Position>> response = alpacaController.getPositions();

        then: "The positions should be retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    @Test
    def "Should retrieve a Portfolio successfully"() {
        int period = 1;
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now();
        String extended = "false";

        when: "Getting the portfolio"
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(
                period,
                unit,
                timeFrame,
                localDate,
                extended
        );

        then: "The portfolio should be retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    @Test
    def "Invalid period length for retrieving a Portfolio"() {
        when: "Getting the portfolio with invalid period"
        int period = -1;
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now();
        String extended = "false";

        then: "Should not retrieve a portfolio with negative period length"
        ResponseEntity<PortfolioHistory> response = createPortfolioRequest(period, unit, timeFrame, localDate, extended)
        assert response == ResponseEntity.of(Optional.empty());
    }

    @Test
    def "Invalid unit for retrieving a Portfolio"() {
        when: "Getting the portfolio with invalid unit"
        int period = 1;
        String unit = null
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now();
        String extended = "false";

        then: "Should not retrieve a portfolio with null unit"
        ResponseEntity<PortfolioHistory> response = createPortfolioRequest(period, unit, timeFrame, localDate, extended)
        assert response == ResponseEntity.of(Optional.empty());
    }

    @Test
    def "Invalid timeFrame for retrieving a Portfolio"() {
        when: "Getting the portfolio with invalid time frame"
        int period = 1;
        String unit = "WEEK"
        String timeFrame = null
        LocalDate localDate = LocalDate.now();
        String extended = "false";

        then: "Should not retrieve a portfolio with null time frame"
        ResponseEntity<PortfolioHistory> response = createPortfolioRequest(period, unit, timeFrame, localDate, extended)
        assert response == ResponseEntity.of(Optional.empty());
    }

    @Test
    def "Invalid local date for retrieving a Portfolio"() {
        when: "Getting the portfolio with invalid local date"
        int period = 1;
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = null
        String extended = "false";

        then: "Should not retrieve a portfolio with null local date"
        ResponseEntity<PortfolioHistory> response = createPortfolioRequest(period, unit, timeFrame, localDate, extended)
        assert response == ResponseEntity.of(Optional.empty());
    }

    @Test
    def "Invalid extended parameter for retrieving a Portfolio"() {
        when: "Getting the portfolio with invalid extended parameter"
        int period = 1;
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now();
        String extended = null

        then: "Should not retrieve a portfolio with null extended parameter"
        ResponseEntity<PortfolioHistory> response = createPortfolioRequest(period, unit, timeFrame, localDate, extended)
        assert response == ResponseEntity.of(Optional.empty());
    }

    // TODO: Make a class later that creates and encapsulates our requests with methods like this one below to be reusable
    def createPortfolioRequest(int period, String unit, String timeFrame, LocalDate localDate, String extended) {
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(
                period,
                unit,
                timeFrame,
                localDate,
                extended
        );

        return response;
    }
}
