package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

/**
 * The LimitOrder Decorator for AlpacaAPI.
 * A limit order is an order to buy or sell at a specified price or better.
 */

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LimitOrderDecorator extends OrderDecorator {

   public Order order;

   @Override
   public void decorate() {
      //Do something with order to make it a LimitOrderDecorator
   }
}
