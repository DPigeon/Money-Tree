package com.capstone.moneytree.facade;

import com.capstone.moneytree.model.node.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

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

    public void sendOrderCompletedEmail(User user, String orderId, String orderTotal, String stockName, String subject) {
        String username = user.getUsername();
        String toEmail = user.getEmail();
        String text = setOrderCompletedTemplate(username, orderId, orderTotal, stockName);
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

    private String setOrderCompletedTemplate(String username, String orderId, String orderTotal, String stockName) {
        String urlEnv = activeProfile.equals("local") ? "http://localhost:4200/": activeProfile.equals("dev")
                ? "https://dev.money-tree.tech/":"https://money-tree.tech";

        return "Hello " + username + ",\n" +
                "Thank you for trading with us. Your order details are indicated below." +
                " If you would like to view the status of your order, please visit " +
                "<a href='" + urlEnv + "'>Your Orders</a>.\n\n" +
                "Order ID: " + orderId + "\n" +
                "Order Total: " + orderTotal + "\n" +
                "Stock Purchased: " + stockName + "\n\n" +
                "We hope that you trade with us again soon!\n" +
                "<b>Money-Tree.tech</b>";
    }
}
