package com.capstone.moneytree.facade;

import com.capstone.moneytree.model.Mail;
import com.capstone.moneytree.model.node.User;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Component
public class EmailSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailSender.class);

    @Autowired
    JavaMailSender mailSender;

    public void sendOrderCompletedEmail(User user, TradeUpdate trade) {
        Mail mail = constructMail(user, trade);
        String text = mail.toString();
        send(mail.getEmail(), mail.getSubject(), text);
    }

    private Mail constructMail(User user, TradeUpdate trade) {
        String username = user.getUsername();
        String toEmail = user.getEmail();
        Mail mail = Mail.builder().build();
        mail.setEmail(toEmail);
        mail.setUsername(username);
        mail.setTradeUpdate(trade);

        return mail;
    }

    private void send(String to, String subject, String text) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            String from = System.getenv().get("SPRING_BOOT_EMAIL");
            messageHelper.setFrom(from);
            messageHelper.setTo(to);
            messageHelper.setSubject(subject);
            messageHelper.setText(text);

            mailSender.send(mimeMessage);
            LOGGER.info("Email sent to {}", to);
        } catch (MessagingException e) {
            LOGGER.error("Error sending email: {}", e.getMessage());
        }
    }
}