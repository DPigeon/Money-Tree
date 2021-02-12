package com.capstone.moneytree.facade;

import com.capstone.moneytree.model.node.User;
import net.jacobpeterson.domain.alpaca.order.Order;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.ZonedDateTime;

@Component
public class EmailSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailSender.class);

    @Value("${spring.profiles.active}")
    private final String activeProfile;

    @Autowired
    private final JavaMailSender mailSender;

    public EmailSender(JavaMailSender mailSender, String activeProfile) {
        this.mailSender = mailSender;
        this.activeProfile = activeProfile;
    }

    public void sendOrderCompletedEmail(User user, TradeUpdate trade, String subject) {
        String username = user.getUsername();
        String toEmail = user.getEmail();
        String text = setOrderCompletedTemplate(username, trade);
        send(toEmail, subject, text);
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

    private String setOrderCompletedTemplate(String username, TradeUpdate trade) {
        Order order = trade.getOrder();
        String stockName = order.getSymbol();
        String quantity = order.getQty();
        String action = order.getType();
        String avgPrice = order.getFilledAvgPrice();
        ZonedDateTime timestamp = trade.getTimestamp();
        String totalAmount = trade.getPrice();
        String urlEnv = activeProfile.equals("local") ? "http://localhost:4200/": activeProfile.equals("dev")
                ? "https://dev.money-tree.tech/":"https://money-tree.tech";

        return "Hello " + username + ",\n" +
                "Thank you for trading with us. Your order details are indicated below." +
                " If you would like to view the status of your order, please visit " +
                "<a href='" + urlEnv + "'>Your Orders</a>.\n\n" +
                "Stock Purchased: " + stockName + "\n" +
                "Quantity: " + quantity + "\n" +
                "Average Share Price: " + avgPrice + "\n" +
                "Timestamp: " + timestamp.toString() + "\n" +
                "Total Amount: " + totalAmount + "\n" +
                "Action: " + action + "\n\n" +
                "We hope that you trade with us again soon!\n" +
                "<b>Money-Tree.tech</b>";
    }
}
