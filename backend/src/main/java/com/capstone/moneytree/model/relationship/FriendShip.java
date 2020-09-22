package com.capstone.moneytree.model.relationship;

import com.capstone.moneytree.model.node.User;
import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;
import org.neo4j.ogm.annotation.typeconversion.DateLong;

import java.util.Date;

@RelationshipEntity(type = "FRIENDSHIP")
public class FriendShip {

    Long id;

    @StartNode
    User friendOne;

    @EndNode
    User friendTwo;

    @DateLong
    Date friendShipDate;

    FriendShip() {

    }
}
