package com.capstone.moneytree.facade


import com.icegreen.greenmail.util.GreenMailUtil
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate
import org.junit.Rule
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import java.time.ZonedDateTime

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import com.capstone.moneytree.model.node.User
import spock.lang.Specification

import com.icegreen.greenmail.util.GreenMail
import com.icegreen.greenmail.util.ServerSetup
import org.junit.rules.ExternalResource
import javax.mail.internet.MimeMessage

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class EmailSenderIT extends Specification {

    @Rule
    public SmtpServerRule smtpServerRule = new SmtpServerRule(2525)

    @Autowired
    private EmailSender emailSender

    /**
     * To test sending a real email as an
     * E2E test here, change the email field
     * to your email. Don't forget to change
     * active profiles to "dev" as well.
     */
    def "It should send an email successfully"() {
        given: "A user that has an order completed"
        String email = "test@money-tree.tech"
        String username = "Dud"
        User user = createUser(email, username, "password", "Dude", "Joe", "F^ef3tS")
        String orderId = "1203432"
        ZonedDateTime timestamp = ZonedDateTime.now()
        String symbol = "AAPL"
        TradeUpdate trade = createTradeUpdate(orderId, "1", symbol, "5", "3", "Buy", "50", "30", "fill", "30", timestamp, "2")

        when: "Money-Tree sends an email"
        emailSender.sendOrderCompletedEmail(user, trade)

        then: "Email is sent properly"
        MimeMessage[] receivedMessages = smtpServerRule.getMessages()
        receivedMessages.length == 1

        MimeMessage receivedMessage = receivedMessages[0]
        GreenMailUtil.getBody(receivedMessage).contains("Hello " + username)
        receivedMessage.getAllRecipients()[0].toString() == email
    }

    def "It should throw an illegal address if no destination"() {
        given: "A user that has an order completed"
        String email = ""
        User user = createUser(email, "Fab", "password", "Dave", "Joe", "F^ef3tS")
        String orderId = "1203432"
        ZonedDateTime timestamp = ZonedDateTime.now()
        String symbol = "AAPL"
        TradeUpdate trade = createTradeUpdate(orderId, "1", symbol, "5", "3", "Buy", "50", "30", "fill", "30", timestamp, "2")

        when: "Send an email"
        emailSender.sendOrderCompletedEmail(user, trade)

        then: "Should give an illegal address error"
        MimeMessage[] receivedMessages = smtpServerRule.getMessages()
        receivedMessages.length == 0
    }
}

/**
 * Used for integration tests with sending emails
 */
class SmtpServerRule extends ExternalResource {

    private GreenMail smtpServer
    private final int port

    SmtpServerRule(int port) {
        this.port = port
    }

    @Override
    protected void before() throws Throwable {
        super.before()
        smtpServer = new GreenMail(new ServerSetup(port, null, "smtp"))
        smtpServer.setUser("username", "secret") // Same as application-test.properties
        smtpServer.start()
    }

    MimeMessage[] getMessages() {
        return smtpServer.getReceivedMessages()
    }

    @Override
    protected void after() {
        super.after()
        smtpServer.stop()
    }
}

