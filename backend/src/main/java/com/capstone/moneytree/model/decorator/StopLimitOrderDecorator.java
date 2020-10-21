package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StopLimitOrderDecorator extends OrderDecorator{
   public Order order;
   @Override
   public void decorate() {
      //Do something with order to make it a StopLimitOrderDecorator
   }
}
