package com.capstone.moneytree.model;

import com.capstone.moneytree.model.node.User;
import lombok.Data;

/**
 * Used to return only the necessary info about a user for
 * follower/followings API and other APIs
 */
@Data
public class SanitizedUser {

    Long id;
    String firstName;
    String lastName;
    String username;
    String avatarURL;
    String coverPhotoURL;
    String biography;
    Double score;
    Double rank;
    Float balance;

    public SanitizedUser(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.avatarURL = user.getAvatarURL();
        this.coverPhotoURL = user.getCoverPhotoURL();
        this.score = user.getScore();
        this.rank = user.getRank();
        this.balance = user.getBalance();
        this.biography = user.getBiography();
    }
}