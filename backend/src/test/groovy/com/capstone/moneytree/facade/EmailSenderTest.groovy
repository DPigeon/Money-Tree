package com.capstone.moneytree.facade

import org.springframework.mail.javamail.JavaMailSenderImpl
import spock.lang.Ignore

import javax.mail.MessagingException

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
        emailSender = new EmailSender(mailSender, profile)
    }

    @Ignore("Will fix later")
    def "It should send an email successfully"() {
        given: "A user that has an order completed"
        User user = createUser(1, "order@money-tree.tech", "Dave", "password", "Dave", "Joe", "F^ef3tS")
        String orderId = "1203432";
        String orderTotal = "40.0"
        String stockName = "AAPL"
        String subject = "Your Money-Tree order #" + orderId

        when: "Money-Tree sends an email"
        emailSender.sendOrderCompletedEmail(user, orderId, orderTotal, stockName, subject)

        then: "No errors thrown"
    }

    @Ignore("Will fix later")
    def "It should throw an illegal address if no destination"() {
        given: "A user that has an order completed"
        User user = createUser(1, "", "Fab", "password", "Dave", "Joe", "F^ef3tS")
        String orderId = "1203432";
        String orderTotal = "40.0"
        String stockName = "AAPL"
        String subject = "Your Money-Tree order #" + orderId

        when: "Send an email"
        emailSender.sendOrderCompletedEmail(user, orderId, orderTotal, stockName, subject)

        then: "Should give an illegal address error"
    }
}
