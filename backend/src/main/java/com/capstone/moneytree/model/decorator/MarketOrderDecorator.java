package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

/**
 * The MarketOrder Decorator for AlpacaAPI.
 * A market order is a request to buy or sell a security at the currently available market price.
 */

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketOrderDecorator extends OrderDecorator {

   public Order order;

   @Override
   public void decorate() {
      //Do something with order to make it a MarketOrderDecorator
   }
}
