package com.capstone.moneytree.model;

import com.capstone.moneytree.model.node.User;

public class SanitizedUser { // this class will be used to return only the necessary info about a user for
                             // follower/followings api and other apis
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

    // setters and getters needed so that json response can be created (avoiding
    // faster.xml exception)
    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public Float getBalance() {
        return balance;
    }

    public void setBalance(Float balance) {
        this.balance = balance;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getCoverPhotoURL() {
        return coverPhotoURL;
    }

    public void setCoverPhotoURL(String coverPhotoURL) {
        this.coverPhotoURL = coverPhotoURL;
    }

}