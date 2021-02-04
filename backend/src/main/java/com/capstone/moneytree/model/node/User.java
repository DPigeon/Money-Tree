package com.capstone.moneytree.model.node;

import com.capstone.moneytree.model.Entity;
import lombok.*;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.HashSet;
import java.util.Set;

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
    Set<Stock> stocks;

    @Relationship(type = "MADE")
    Set<Transaction> transactions;

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
        this.getTransactions().add(transaction);
    }

    public void owns(Stock stock) {
        this.getStocks().add(stock);
    }
}



    