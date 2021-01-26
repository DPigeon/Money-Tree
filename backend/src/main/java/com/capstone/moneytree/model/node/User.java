package com.capstone.moneytree.model.node;

import java.util.List;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import com.capstone.moneytree.model.Entity;

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
public class User extends Entity {

    String firstName;

    String lastName;

    String username;

    String avatarURL;

    String email;

    Double score;

    Double rank;

    Float balance;

    String password; // Must be encrypted

    String alpacaApiKey;

    @Relationship(type = "FOLLOWS", direction = Relationship.INCOMING)
    List<User> followers;

    @Relationship(type = "OWNS")
    List<Stock> stocks;

    @Relationship(type = "MADE")
    List<Transaction> transactions;

    public void follows(User user) {
        user.getFollowers().add(this);
    }

    public void followedBy(User user) {
        this.getFollowers().add(user);
    }

    public void made(Transaction transaction) {
        this.getTransactions().add(transaction);
    }

    public void owns(Stock stock) {
        this.getStocks().add(stock);
    }
}



    