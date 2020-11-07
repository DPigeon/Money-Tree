package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

/**
 * The StopOrder Decorator for AlpacaAPI.
 * A stop (market) order is an order to buy or sell a security when its price moves past a
 * particular point, ensuring a higher probability of achieving a predetermined entry or exit price.
 */

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StopOrderDecorator extends OrderDecorator {

   public Order order;

   @Override
   public void decorate() {
      //Do something with order to make it a StopOrderDecorator
   }
}
