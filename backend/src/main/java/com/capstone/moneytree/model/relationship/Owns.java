package com.capstone.moneytree.model.relationship;

import java.util.Date;

import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;
import org.neo4j.ogm.annotation.typeconversion.DateLong;

import com.capstone.moneytree.model.Entity;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@RelationshipEntity(type = "OWNS")
@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Owns extends Entity {

   float quantity;

   float averagePurchasedPrice;

   @StartNode
   User user;

   @EndNode
   Stock stock;

   @DateLong
   Date since;
}
