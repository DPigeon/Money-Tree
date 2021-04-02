
package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.model.node.User
import net.jacobpeterson.alpaca.enums.PortfolioTimeFrame
import net.jacobpeterson.domain.alpaca.clock.Clock
import org.springframework.beans.factory.annotation.Autowired
import com.capstone.moneytree.config.DefaultStompFrameHandlerConfig
import com.capstone.moneytree.config.WebSocketClientConfig
import spock.lang.Ignore
import org.springframework.messaging.simp.stomp.StompSession

import java.time.LocalDate

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles

import net.jacobpeterson.domain.alpaca.account.Account
import net.jacobpeterson.domain.alpaca.portfoliohistory.PortfolioHistory
import net.jacobpeterson.domain.alpaca.position.Position
import spock.lang.Specification

import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingDeque

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

/**
 * Integration Tests for the Alpaca Controller.
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("dev")
class AlpacaControllerIT extends Specification {

    private static final String O_AUTH_TOKEN_TEST = "545e5eee-7ee0-4b17-83db-a8cd95e0570e"
    private static final String WS_CHANNEL_TRADE_UPDATES = "/queue/user-";
    private static final String MESSAGE_MAPPING_TRADE_UPDATES = "/app/trade/updates"
    private static final String MESSAGE_MAPPING_DISCONNECT = "/app/trade/disconnect"

    @Autowired
    private AlpacaController alpacaController

    @Autowired
    UserDao userDao

    String email = "test322315@money.com"
    User createdUser = createUser(email, "Raz", "pass", "Raz", "Ben", O_AUTH_TOKEN_TEST)

    def "Should retrieve an Alpaca account successfully"() {
        setup: "Create the user"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)

        when: "Getting an Alpaca account"
        ResponseEntity<Account> response = alpacaController.getAccount(user.getId().toString())


        then: "The account should be retrieved"
        assert response.statusCode == HttpStatus.OK
        assert response.body.id != null

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Should retrieve the Market Clock"() {
        setup: "Create the user"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)

        when: "Getting the Market Clock"
        ResponseEntity<Clock> response = alpacaController.getMarketClock(user.getId().toString())

        then: "The account should be retrieved"
        assert response.statusCode == HttpStatus.OK
        assert response.body.timestamp != null
        assert response.body.nextOpen != null
        assert response.body.nextClose != null

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Should retrieve a list of positions successfully"() {
        setup: "Create the user"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)

        when: "Getting a list of positions"
        ResponseEntity<List<Position>> response = alpacaController.getPositions(user.getId().toString())

        then: "The positions should be retrieved"
        assert response.statusCode == HttpStatus.OK
        assert !response.body.isEmpty()

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Should retrieve a Portfolio successfully"() {
        setup: "Create the user with portfolio info"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)
        int period = 1
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        String localDate = LocalDate.now().toString()
        String extended = "false"

        when: "Getting the portfolio"
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(
                user.getId().toString(),
                period,
                unit,
                timeFrame,
                localDate,
                extended
        )

        then: "The portfolio should be retrieved"
        assert response.statusCode == HttpStatus.OK
        assert response.body.timeframe == PortfolioTimeFrame.FIFTEEN_MINUTE
        assert !response.body.timestamp.isEmpty()

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Invalid unit for retrieving a Portfolio"() {
        setup: "Create the user with portfolio info"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)
        int period = 1
        String unit = null
        String timeFrame = "FIFTEEN_MINUTE"
        String localDate = LocalDate.now().toString()
        String extended = "false"

        when: "Getting the portfolio with invalid unit"
        alpacaController.getPortfolio(
                user.getId().toString(),
                period,
                unit,
                timeFrame,
                localDate,
                extended
        )

        then: "Should not retrieve a portfolio with null unit"
        thrown(NullPointerException)

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Invalid timeFrame for retrieving a Portfolio"() {
        setup: "Create the user with portfolio info"
        userDao.save(createdUser)
        def user = userDao.findUserByEmail(email)
        int period = 1
        String unit = "WEEK"
        String timeFrame = null
        String localDate = LocalDate.now().toString()
        String extended = "false"

        when: "Getting the portfolio with invalid time frame"
        alpacaController.getPortfolio(
                user.getId().toString(),
                period,
                unit,
                timeFrame,
                localDate,
                extended
        )

        then: "Should not retrieve a portfolio with null time frame"
        thrown(NullPointerException)

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    @Ignore("Only run locally for an E2E backend test")
    def "Should connect to the WebSocket server"() {
        given:
        String userIdMessage = "1"
        int timeout = 5
        StompSession session = WebSocketClientConfig.createSession(timeout);
        BlockingQueue<String> blockingQueue = new LinkedBlockingDeque<>();

        when: "Subscribing to the channel and sending a user ID frame"
        session.subscribe(WS_CHANNEL_TRADE_UPDATES + userIdMessage, new DefaultStompFrameHandlerConfig(blockingQueue) {})
        session.send(MESSAGE_MAPPING_TRADE_UPDATES, userIdMessage.getBytes());

        then: "Should be connected and ready to receive trade updates"
        assert session.isConnected()
        assert blockingQueue.size() == 0
    }

    @Ignore("Only run locally for an E2E backend test")
    def "Should disconnect from the WebSocket server"() {
        given:
        String userIdMessage = "1"
        int timeout = 5
        StompSession session = WebSocketClientConfig.createSession(timeout);
        BlockingQueue<String> blockingQueue = new LinkedBlockingDeque<>();

        when: "Subscribing to the channel and sending a user ID frame"
        session.subscribe(WS_CHANNEL_TRADE_UPDATES + userIdMessage, new DefaultStompFrameHandlerConfig(blockingQueue) {})
        session.send(MESSAGE_MAPPING_TRADE_UPDATES, userIdMessage.getBytes());
        Thread.sleep(5000)
        session.send(MESSAGE_MAPPING_DISCONNECT, userIdMessage.getBytes());

        then: "Should be disconnected from the WebSocket server"
        assert blockingQueue.size() == 0
    }
}

