package com.capstone.moneytree.utils

import com.capstone.moneytree.facade.SmtpServerRuleUtils
import org.junit.Test
import spock.lang.Specification

import javax.mail.internet.MimeMessage

class SmtpServerRuleUtilsTest extends Specification {

    private SmtpServerRuleUtils smtpServerRuleUtils

    @Test
    def "It should initialize the smtpServer"() {
        given: "A mocked port for emails"
        int port = 2525

        when: "Initializes the smtpServer"
        smtpServerRuleUtils = new SmtpServerRuleUtils(port)

        then:
        assert smtpServerRuleUtils != null
    }

    @Test
    def "It should get messages from smtpServer"() {
        given: "A mocked port for emails and a server"
        int port = 2525
        smtpServerRuleUtils = new SmtpServerRuleUtils(port)
        smtpServerRuleUtils.before()

        when: "retrieving the messages"
        MimeMessage[] messages = smtpServerRuleUtils.getMessages()
        smtpServerRuleUtils.after()

        then: "Get the right messages"
        assert messages.length == 0
    }
}
