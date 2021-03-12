package com.capstone.moneytree.model;

import java.util.List;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class UserCompleteProfile extends User {
    public List<SanitizedUser> followers;
    public List<SanitizedUser> following;
    public List<SanitizedStock> ownedStocks;
    public List<Transaction> userTransactions;

}
