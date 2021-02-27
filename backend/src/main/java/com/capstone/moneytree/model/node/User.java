package com.capstone.moneytree.model.node;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.neo4j.ogm.annotation.NodeEntity;

import com.capstone.moneytree.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(firstName)
                .append(lastName)
                .append(username)
                .append(avatarURL)
                .append(coverPhotoURL)
                .append(email)
                .append(score)
                .append(rank)
                .append(balance)
                .append(password)
                .append(alpacaApiKey)
                .append(biography)
                .toHashCode();
    }

    @Override
    public boolean equals(Object object) {
        if (object instanceof User) {
            User other = (User) object;
            return this.getId().equals(other.getId());
        }

        return false;
    }
}