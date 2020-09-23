package com.capstone.moneytree.model;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;

public class Entity {

    @Id
    @GeneratedValue
    private Long id;

    public Long getId() {
        return id;
    }
}
