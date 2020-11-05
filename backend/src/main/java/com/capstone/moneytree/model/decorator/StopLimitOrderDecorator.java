package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

/**
 * The StopLimit Decorator for AlpacaAPI.
 * A stop-limit order is a conditional trade over a set time frame that combines the features of
 * a stop order with those of a limit order and is used to mitigate risk.
 */

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StopLimitOrderDecorator extends OrderDecorator {

   public Order order;

   @Override
   public void decorate() {
      //Do something with order to make it a StopLimitOrderDecorator
   }
}
