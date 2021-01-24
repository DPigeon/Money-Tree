package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

/**
 * The MarketOrder Decorator for AlpacaAPI.
 * A market order is a request to buy or sell a security at the currently available market price.
 */

@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MarketOrderDecorator extends OrderDecorator {

   private Order order;

   @Override
   public void decorate() {
      //Do something with order to make it a MarketOrderDecorator
   }
}
