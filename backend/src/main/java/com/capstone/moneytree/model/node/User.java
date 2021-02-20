package com.capstone.moneytree.model.node;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import com.capstone.moneytree.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

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

    String coverPhotoURL;
    
    String email;

    Double score;

    Double rank;

    Float balance;

    String password; // Must be encrypted

    String alpacaApiKey;

    String biography;

    @Relationship(type = "FOLLOWS")
    Set<User> followers;

    @Relationship(type = "OWNS")
    List<Stock> stocks;

    @Relationship(type = "MADE")
    List<Transaction> transactions;

    @Override
    public boolean equals(Object object) {
        if (object instanceof User){
            User other = (User) object;
            return this.getId().equals(other.getId());
        }

        return false;
    }

    @Override
    public int hashCode() {
        return Math.toIntExact(this.getId());
    }

    public void follow(User user) {
        if (followers == null) {
            followers = new HashSet<>();
        }
        followers.add(user);
    }

    public void unfollow(User user) {
        if (followers != null && !followers.isEmpty()) {
            followers.remove(user);
        }
    }

    public void made(Transaction transaction) {
        if (this.transactions == null) {
            this.transactions = Collections.emptyList();
        }
        this.getTransactions().add(transaction);
    }

    public void owns(Stock stock) {
        if (this.stocks == null) {
            this.stocks = Collections.emptyList();
        }
        this.getStocks().add(stock);
    }
}    