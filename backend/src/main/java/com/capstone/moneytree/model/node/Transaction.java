package com.capstone.moneytree.model.node;


import java.util.Set;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import com.capstone.moneytree.model.Entity;
import com.capstone.moneytree.model.OrderType;
import com.capstone.moneytree.model.TransactionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
