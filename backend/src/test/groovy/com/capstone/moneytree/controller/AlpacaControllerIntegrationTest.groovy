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
   private static final String API_VERSION = "v2"
   private static final String KEY_ID = System.getenv().get("ALPACA_KEY_ID")
   private static final String SECRET = System.getenv().get("ALPACA_SECRET_ID")
   private static final String BASE_API_URL = "https://paper-api.alpaca.markets"
   private static final String BASE_DATA_URL = "https://data.alpaca.markets"

   @Shared
   def alpacaController

   @Shared
   def marketInteractionsFacade;

   def setupSpec() {
      marketInteractionsFacade = new MarketInteractionsFacade(API_VERSION, KEY_ID, SECRET, BASE_API_URL, BASE_DATA_URL)
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
      given:
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
   def "Invalid unit for retrieving a Portfolio"() {
      given:
      int period = 1;
      String unit = null
      String timeFrame = "FIFTEEN_MINUTE"
      LocalDate localDate = LocalDate.now();
      String extended = "false";

      when: "Getting the portfolio with invalid unit"
      createPortfolioRequest(period, unit, timeFrame, localDate, extended)

      then: "Should not retrieve a portfolio with null unit"
      thrown(NullPointerException)
   }

   @Test
   def "Invalid timeFrame for retrieving a Portfolio"() {
      given:
      int period = 1;
      String unit = "WEEK"
      String timeFrame = null
      LocalDate localDate = LocalDate.now();
      String extended = "false";

      when: "Getting the portfolio with invalid time frame"
      createPortfolioRequest(period, unit, timeFrame, localDate, extended)

      then: "Should not retrieve a portfolio with null time frame"
      thrown(NullPointerException)
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
