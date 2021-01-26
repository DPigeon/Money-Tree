package com.capstone.moneytree.model.node;

import org.neo4j.ogm.annotation.NodeEntity;

import com.capstone.moneytree.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.jacobpeterson.domain.alpaca.asset.Asset;

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

   /* Asset from alpaca fulfilling the stock */
   Asset asset;
}
