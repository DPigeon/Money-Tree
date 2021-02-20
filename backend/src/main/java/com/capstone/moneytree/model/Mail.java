package com.capstone.moneytree.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;
import net.jacobpeterson.domain.alpaca.streaming.trade.TradeUpdate;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mail {

    private String email;
    private String subject;
    private String username;
    private TradeUpdate tradeUpdate;

    public String toString() {
        Order order = tradeUpdate.getOrder();
        String orderId = order.getId();
        subject = "Your Money-Tree order #" + orderId;

        String stockName = order.getSymbol();
        String quantity = order.getQty();
        String action = order.getType();
        String avgPrice = order.getFilledAvgPrice();
        ZonedDateTime timestamp = tradeUpdate.getTimestamp();
        String totalAmount = tradeUpdate.getPrice();

        return constructBody(stockName, quantity, action, avgPrice, timestamp, totalAmount);
    }

    private String constructBody(String stockName, String qty, String action, String avgPrice, ZonedDateTime timestamp, String totalAmount) {
        return "Hello " + username + ",\n" +
                "Thank you for trading with us. Your order details are indicated below.\n" +
                "If you would like to view the status of your order, please visit http://money-tree.tech.\n\n" +
                "Stock Purchased: " + stockName + "\n" +
                "Quantity: " + qty + "\n" +
                "Average Share Price: $" + avgPrice + "\n" +
                "Time of Purchase: " + timestamp.getMonth().getValue() + "/" + timestamp.getDayOfMonth() + "/" + timestamp.getYear() +
                " at " + timestamp.getHour() + ":" + timestamp.getMinute() + ":" + timestamp.getSecond() + "\n" +
                "Total Amount: $" + totalAmount + "\n" +
                "Action: " + action + "\n\n" +
                "We hope that you trade with us again soon!\n" +
                "Money-Tree.tech";
    }
}
