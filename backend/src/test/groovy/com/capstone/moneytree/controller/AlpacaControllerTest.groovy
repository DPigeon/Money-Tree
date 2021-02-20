package com.capstone.moneytree.controller

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.facade.EmailSender
import com.capstone.moneytree.facade.MarketInteractionsFacade
import org.junit.Test
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.messaging.simp.SimpMessagingTemplate
import spock.lang.Specification

class AlpacaControllerTest extends Specification {

    private static final String API_VERSION = "v2"
    private static final String KEY_ID = System.getenv().get("ALPACA_KEY_ID")
    private static final String SECRET = System.getenv().get("ALPACA_SECRET_ID")
    private static final String BASE_API_URL = "https://paper-api.alpaca.markets"
    private static final String BASE_DATA_URL = "https://data.alpaca.markets"

    SimpMessagingTemplate messageSender

    def marketInteractionsFacade = new MarketInteractionsFacade(API_VERSION, KEY_ID, SECRET, BASE_API_URL, BASE_DATA_URL)

    private AlpacaController alpacaController
    private UserDao userDao

    def setup() {
        alpacaController = new AlpacaController(marketInteractionsFacade, messageSender)
        userDao = Mock()
    }

    @Test
    def "It should listen to trade updates before sending an email when order completed"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1";

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId);

        then: "No exception thrown"
    }

    @Test
    def "It should disconnect from trade updates when asked"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1";

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId);
        Thread.sleep(2000)
        alpacaController.disconnectFromTradeUpdates(userId)

        then: "No exception thrown"
    }
}
