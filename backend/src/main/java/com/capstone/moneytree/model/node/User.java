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

    String coverPhotoURL;
    
    String email;

    Double score;

    Double rank;

    Float balance;

    String password; // Must be encrypted

    String alpacaApiKey;

    String biography;

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

    public String getCoverPhotoURL() {
        return coverPhotoURL;
    }

    public void setCoverPhotoURL(String coverPhotoURL) {
        this.coverPhotoURL = coverPhotoURL;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAlpacaApiKey() {
        return alpacaApiKey;
    }

    public void setAlpacaApiKey(String alpacaApiKey) {
        this.alpacaApiKey = alpacaApiKey;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public List<User> getFollowers() {
        return followers;
    }

    public void setFollowers(List<User> followers) {
        this.followers = followers;
    }

    public List<Stock> getStocks() {
        return stocks;
    }

    public void setStocks(List<Stock> stocks) {
        this.stocks = stocks;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}



    