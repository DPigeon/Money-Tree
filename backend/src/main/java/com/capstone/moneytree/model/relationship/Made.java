package com.capstone.moneytree.model.relationship;

import java.time.ZonedDateTime;

import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;
import org.neo4j.ogm.annotation.GeneratedValue;

import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RelationshipEntity(type = "Made")
public class Made {

    @Id
    @GeneratedValue
    private Long id;

    @StartNode
    User user;

    @EndNode
    Transaction transaction;

    ZonedDateTime transactionDate;

    public Made(User user, Transaction transaction, ZonedDateTime transactionDate) {
        this.user = user;
        this.transaction = transaction;
        this.transactionDate = transactionDate;
    }
}
