package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.testconfig.DefaultStompFrameHandlerConfig
import com.capstone.moneytree.testconfig.WebSocketClientConfig
import org.junit.Rule
import org.neo4j.harness.junit.rule.Neo4jRule
import org.neo4j.ogm.config.Configuration
import org.neo4j.ogm.session.Session
import org.neo4j.ogm.session.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Ignore
import org.springframework.messaging.simp.stomp.StompSession

import java.time.LocalDate

import org.junit.Test
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
 * Integration Tests for the Alpaca Controller. Tests the MarketInteractionFacade as well.
 */

@Ignore
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("dev")
class AlpacaControllerIT extends Specification {

    // TODO: move those into a test properties file later
    private static final O_AUTH_TOKEN_TEST = "b9474f2b-b256-4166-b851-306600a17671"

    private static final String WS_CHANNEL_TRADE_UPDATES = "/queue/user-";
    private static final String MESSAGE_MAPPING_TRADE_UPDATES = "/app/trade/updates"
    private static final String MESSAGE_MAPPING_DISCONNECT = "/app/trade/disconnect"

    @Autowired
    private AlpacaController alpacaController

    @Autowired
    UserDao userDao

    @Rule
    public Neo4jRule neoServer = new Neo4jRule()

    private Session session

    def setup() {
        Configuration configuration = new Configuration.Builder()
                .uri(neoServer.boltURI().toString())
                .build()

        SessionFactory sessionFactory = new SessionFactory(configuration, User.class.getPackage().getName());
        session = sessionFactory.openSession();
        session.purgeDatabase()
    }

    def "Should retrieve an Alpaca account successfully"() {
        setup: "Create the user"
        userDao.save(createUser(14303,"test@money.com", "Raz", "pass", "Raz", "Ben", O_AUTH_TOKEN_TEST))
        def user = userDao.findUserByEmail("test@money.com")

        when: "Getting an Alpaca account"
        ResponseEntity<Account> response = alpacaController.getAccount(user.getId().toString())

        then: "The account should be retrieved"
        assert response.statusCode == HttpStatus.OK

        cleanup: "Delete the created user"
        userDao.delete(user)
    }

    def "Should retrieve a list of positions successfully"() {
        when: "Getting a list of positions"

        ResponseEntity<List<Position>> response = alpacaController.getPositions(userId)

        then: "The positions should be retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    @Test
    def "Should retrieve a Portfolio successfully"() {
        given:
        int period = 1
        String unit = "WEEK"
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now()
        String extended = "false"

        when: "Getting the portfolio"
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(
                "1",
                period,
                unit,
                timeFrame,
                localDate,
                extended
        )

        then: "The portfolio should be retrieved"
        assert response.statusCode == HttpStatus.OK
    }

    @Test
    def "Invalid unit for retrieving a Portfolio"() {
        given:
        int period = 1
        String unit = null
        String timeFrame = "FIFTEEN_MINUTE"
        LocalDate localDate = LocalDate.now()
        String extended = "false"

        when: "Getting the portfolio with invalid unit"
        createPortfolioRequest(period, unit, timeFrame, localDate, extended)

        then: "Should not retrieve a portfolio with null unit"
        thrown(NullPointerException)
    }

    @Test
    def "Invalid timeFrame for retrieving a Portfolio"() {
        given:
        int period = 1
        String unit = "WEEK"
        String timeFrame = null
        LocalDate localDate = LocalDate.now()
        String extended = "false"

        when: "Getting the portfolio with invalid time frame"
        createPortfolioRequest(period, unit, timeFrame, localDate, extended)

        then: "Should not retrieve a portfolio with null time frame"
        thrown(NullPointerException)
    }

    @Test
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

    @Test
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

    // TODO: Make a class later that creates and encapsulates our requests with methods like this one below to be reusable
    def createPortfolioRequest(int period, String unit, String timeFrame, LocalDate localDate, String extended) {
        ResponseEntity<PortfolioHistory> response = alpacaController.getPortfolio(
                "1",
                period,
                unit,
                timeFrame,
                localDate,
                extended
        )

        return response
    }
}
