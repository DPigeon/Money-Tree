package com.capstone.moneytree.controller

import org.springframework.test.context.ActiveProfiles
import spock.lang.Ignore

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import com.capstone.moneytree.dao.UserDao
import com.capstone.moneytree.facade.MarketInteractionsFacade
import org.junit.Test
import org.springframework.messaging.simp.SimpMessagingTemplate
import spock.lang.Specification

@ActiveProfiles("local")
class AlpacaControllerTest extends Specification {

    SimpMessagingTemplate messageSender

    private MarketInteractionsFacade marketInteractionsFacade
    private AlpacaController alpacaController
    private UserDao userDao

    def setup() {
        userDao = Mock()
        marketInteractionsFacade = new MarketInteractionsFacade(userDao)
        alpacaController = new AlpacaController(marketInteractionsFacade, messageSender)
    }

    @Test
    def "It should listen to trade updates before sending an email when order completed"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1";

        and: "Mock user"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId);

        then: "No exception thrown"
    }

    @Test
    def "It should disconnect from trade updates when asked"() {
        given: "A user (ID) subscribing to the trades"
        String userId = "1";

        and: "Mock user"
        userDao.findUserById(Long.parseLong(userId)) >> createUser("test@money.ca", "user", "hello", "Yury", "Yes", "38rbb-sss")

        when: "Order is filled send an email"
        alpacaController.registerToTradeUpdates(userId);
        Thread.sleep(2000)
        alpacaController.disconnectFromTradeUpdates(userId)

        then: "No exception thrown"
    }
}
