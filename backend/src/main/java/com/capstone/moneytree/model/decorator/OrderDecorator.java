package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

@AllArgsConstructor
public abstract class OrderDecorator extends Order {

   public abstract void decorate();
}
