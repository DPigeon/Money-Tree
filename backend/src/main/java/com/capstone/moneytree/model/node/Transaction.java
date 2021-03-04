package com.capstone.moneytree.model.node;

import java.time.ZonedDateTime;

import org.neo4j.ogm.annotation.NodeEntity;

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

   float avgPrice;

   float total;

   ZonedDateTime purchasedAt;

   MoneyTreeOrderType moneyTreeOrderType;

   String clientOrderId;

   TransactionStatus status;

   String symbol;
}
