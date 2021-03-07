package com.capstone.moneytree.model.relationship;

import java.time.ZonedDateTime;

import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;

import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RelationshipEntity(type = "ToFulfill")
public class ToFulfill {
    @Id
    @GeneratedValue
    private Long id;

    @StartNode
    Transaction transaction;

    @EndNode
    Stock stock;

    ZonedDateTime fulfillmentDate;

    public ToFulfill(Transaction transaction, Stock stock, ZonedDateTime fulfillmentDate) {
        this.transaction = transaction;
        this.stock = stock;
        this.fulfillmentDate = fulfillmentDate;
    }

}
