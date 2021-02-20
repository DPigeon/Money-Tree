package com.capstone.moneytree.model

import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate
import org.junit.Test
import spock.lang.Specification

import java.time.ZonedDateTime

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createTradeUpdate

class MailTest extends Specification {

    @Test
    def "It should initialize a mail"() {
        given: "a mail"
        Mail mail = Mail.builder().build()

        when: "properties are added"
        String email = "user@money-tree.tech"
        String username = "user"
        mail.setEmail(email)
        mail.setUsername(username)

        then: "should not be null"
        assert mail != null
    }

    @Test
    def "It should construct the text mail body"() {
        given: "a mail"
        Mail mail = Mail.builder().build()

        when: "we give properties to the mail"
        String email = "user@money-tree.tech"
        String username = "user"
        mail.setEmail(email)
        mail.setUsername(username)
        String orderId = "123"
        ZonedDateTime timestamp = ZonedDateTime.now()
        TradeUpdate trade = createTradeUpdate(orderId, "1", "AAPL", "5", "3", "Buy", "50", "30", "fill", "30", timestamp, "2")
        mail.setTradeUpdate(trade)
        String text = mail.toString()

        then: "it should have constructed the body properly"
        assert mail.getSubject() == "Your Money-Tree order #" + orderId
        assert mail.getEmail() == email
        assert mail.getTradeUpdate() == trade
        assert mail.getUsername() == username
        assert text.contains("Hello " + username)
    }
}
