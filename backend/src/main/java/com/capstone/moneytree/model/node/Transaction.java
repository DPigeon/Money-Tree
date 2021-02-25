package com.capstone.moneytree.model.node;

import java.time.ZonedDateTime;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import com.capstone.moneytree.model.Entity;
import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends Entity {

   float quantity;

   ZonedDateTime purchasedAt;

   MoneyTreeOrderType moneyTreeOrderType;

   String clientOrderId;

   TransactionStatus status;

   @Relationship(type = "FULFILLS", direction = Relationship.INCOMING)
   Stock fulfilledStock;

   public Transaction fulfills(Stock stock) {
      this.setFulfilledStock(stock);
      return this;
   }
}
