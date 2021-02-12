package com.capstone.moneytree.facade

import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate
import org.springframework.mail.javamail.JavaMailSenderImpl
import spock.lang.Ignore

import java.time.ZonedDateTime

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createTradeUpdate
import static com.capstone.moneytree.utils.MoneyTreeTestUtils.createUser

import com.capstone.moneytree.model.node.User
import org.junit.Test
import org.springframework.mail.javamail.JavaMailSender
import spock.lang.Specification

class EmailSenderTest extends Specification {

    private static EmailSender emailSender
    private static JavaMailSender mailSender
    private static String profile = "dev"

    def setup() {
        mailSender = new JavaMailSenderImpl()
        mailSender.setHost("smtp.gmail.com")
        mailSender.setUsername(System.getenv().get("SPRING_BOOT_EMAIL"))
        mailSender.setPassword(System.getenv().get("SPRING_BOOT_EMAIL_PASSWORD"))
        mailSender.setPort(587)
        mailSender.setProtocol("smtp")
        mailSender.properties.put("mail.smtp.auth", "true")
        mailSender.properties.put("mail.smtp.starttls.enable", "true")
        emailSender = new EmailSender(mailSender, profile)
    }

    @Ignore
    def "It should send an email successfully"() {
        // com.sun.mail.smtp.SMTPSendFailedException: 530 5.7.0 Must issue a STARTTLS command first ERROR
        given: "A user that has an order completed"
        User user = createUser(1, "dav_sports_7@hotmail.com", "Dave", "password", "Dave", "Joe", "F^ef3tS")
        String orderId = "1203432";
        ZonedDateTime timestamp = ZonedDateTime.now()
        String symbol = "AAPL"
        TradeUpdate trade = createTradeUpdate(orderId, "1", symbol, "5", "3", "Buy", "50", "30", "fill", "30", timestamp, "2")
        String subject = "Your Money-Tree order #" + orderId

        when: "Money-Tree sends an email"
        emailSender.sendOrderCompletedEmail(user, trade, subject)

        then: "No errors thrown"
    }

    @Ignore("Will fix later")
    def "It should throw an illegal address if no destination"() {
        given: "A user that has an order completed"
        User user = createUser(1, "", "Fab", "password", "Dave", "Joe", "F^ef3tS")
        String orderId = "1203432";
        ZonedDateTime timestamp = ZonedDateTime.now()
        String symbol = "AAPL"
        TradeUpdate trade = createTradeUpdate(orderId, "1", symbol, "5", "3", "Buy", "50", "30", "fill", "30", timestamp, "2")
        String subject = "Your Money-Tree order #" + orderId

        when: "Send an email"
        emailSender.sendOrderCompletedEmail(user, trade, subject)

        then: "Should give an illegal address error"
    }
}
