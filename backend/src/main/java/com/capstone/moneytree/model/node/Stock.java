package com.capstone.moneytree.model.node;

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
public class Stock extends Entity {

   String ticker;

   String label;

   String industry;

   String volatility;
}
