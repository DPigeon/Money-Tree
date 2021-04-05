package com.capstone.moneytree.controller

import net.jacobpeterson.alpaca.AlpacaAPI
import net.jacobpeterson.alpaca.enums.portfolio.PortfolioPeriodUnit
import net.jacobpeterson.alpaca.enums.portfolio.PortfolioTimeFrame
import net.jacobpeterson.domain.alpaca.account.Account
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory
import net.jacobpeterson.domain.alpaca.position.Position
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles

import java.time.LocalDate

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.facade.MarketInteractionsFacade
import org.springframework.messaging.simp.SimpMessagingTemplate
import spock.lang.Specification

@ActiveProfiles("local")
class AlpacaControllerTest extends Specification {

    SimpMessagingTemplate messageSender

    private MarketInteractionsFacade marketInteractionsFacade
    private AlpacaController alpacaController
    private UserDao userDao
    private AlpacaAPI alpacaAPI

    def setup() {
        userDao = Mock()
        alpacaAPI = Mock()
        marketInteractionsFacade = new MarketInteractionsFacade(userDao)
        alpacaController = new AlpacaController(marketInteractionsFacade, messageSender)
    }

    def "It should get an Alpaca account"() {
        given: "A user ID"
        String userId = "59"
        Account account = new Account()

        and: "Mock the database and AlpacaAPI"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")
        alpacaAPI.getAccount() >> account

        when: "Retrieving the account"
        ResponseEntity<Account> response = alpacaController.getAccount(userId)

        then: "Account is retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    def "Should retrieve the open positions"() {
        given: "A user ID"
        String userId = "10332"
        List<Position> positions = new ArrayList<>()

        and: "Mock the database and AlpacaAPI"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")
        alpacaAPI.getOpenPositions() >> positions

        when: "Retrieving the positions"
        ResponseEntity<List<Position>> response = alpacaController.getPositions(userId)

        then: "Positions are retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    def "Should retrieve a portfolio"() {
        given: "A user ID"
        String userId = "10332"
        int period = 1
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        String localDate = LocalDate.now().toString()
        String extended = "false"
        PortfolioHistory portfolio = new PortfolioHistory()

        and: "Mock the database and AlpacaAPI"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")
        alpacaAPI.getPortfolioHistory(period, PortfolioPeriodUnit.valueOf(unit), PortfolioTimeFrame.valueOf(timeFrame), localDate as LocalDate, extended as Boolean) >> portfolio

        when: "Retrieving the portfolio"
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(userId, period, unit, timeFrame, localDate, extended)

        then: "Account is retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    def "It should listen to trade updates before sending an email when order completed"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1"

        and: "Mock user"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId)

        then: "No exception thrown"
    }

    def "It should disconnect from trade updates when asked"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1"

        and: "Mock user"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId)
        Thread.sleep(2000)
        alpacaController.disconnectFromTradeUpdates(userId)

        then: "No exception thrown"
    }
}
