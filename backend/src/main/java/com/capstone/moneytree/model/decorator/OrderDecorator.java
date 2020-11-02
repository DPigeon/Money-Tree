package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public abstract class OrderDecorator extends Order {

   public abstract void decorate();

}
