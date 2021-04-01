package com.capstone.moneytree.model;

import java.util.List;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

import lombok.Data;

@Data
public class UserCompleteProfile {

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
    Float percentile;
    List<SanitizedUser> followers;
    List<SanitizedUser> following;
    List<SanitizedStock> ownedStocks;
    List<Transaction> transactions;

    public UserCompleteProfile(User user) {
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
