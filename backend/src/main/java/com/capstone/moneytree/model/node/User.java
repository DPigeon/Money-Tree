package com.capstone.moneytree.model.node;

import com.capstone.moneytree.model.Entity;
import lombok.*;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.Set;

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

    double score;

    double rank;

    float balance;

    String password;

    @Relationship(type = "FOLLOWS", direction = Relationship.INCOMING)
    Set<User> followers;

    @Relationship(type = "OWNS")
    Set<Stock> stocks;

    @Relationship(type = "MADE")
    Set<Transaction> transactions;
}
