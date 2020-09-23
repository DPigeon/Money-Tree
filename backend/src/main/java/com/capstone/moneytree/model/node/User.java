package com.capstone.moneytree.model.node;

import com.capstone.moneytree.model.Entity;
import lombok.*;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.Set;

@NodeEntity
@Data
public class User extends Entity {

    String firstName;

    String lastName;

    @Relationship( type = "FRIENDSHIP")
    Set<User> friends;
}
