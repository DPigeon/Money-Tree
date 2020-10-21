package com.capstone.moneytree.model.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.order.Order;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public abstract class OrderDecorator extends Order {

//   @Override
//   public boolean equals(Object other) {
//      if (other == this) {
//         return true;
//      } else if (!(other instanceof OrderDecorator)) {
//         return false;
//      } else {
//         return this.equals(other);
//      }
//   }
//
//   @Override
//   public int hashCode(){
//      return super.hashCode();
//   }

   public abstract void decorate();

}
