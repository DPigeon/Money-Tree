package com.capstone.moneytree.model.node;


import java.util.Set;

import lombok.*;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import com.capstone.moneytree.model.Entity;
import com.capstone.moneytree.model.OrderType;
import com.capstone.moneytree.model.TransactionStatus;

@EqualsAndHashCode(callSuper = true)
@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends Entity {

   float quantity;

   float purchasedAt;

   OrderType orderType;

   TransactionStatus status;

   @Relationship(type = "FULFILLS")
   Set<Stock> fulfilledStocks;

   public void fulfills(Stock stock) {
      this.getFulfilledStocks().add(stock);
   }

}
