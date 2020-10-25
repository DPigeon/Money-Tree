package com.capstone.moneytree.facade;

import net.jacobpeterson.alpaca.AlpacaAPI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * This facade abstracts the Alpaca API and exposes only the relevant
 * methods for MoneyTree.
 * */

@Component
public class MarketInteractionsFacade {

   private static final Logger LOGGER = LoggerFactory.getLogger(MarketInteractionsFacade.class);
   private final AlpacaAPI alpacaAPI;

   @Autowired
   public MarketInteractionsFacade() {
      alpacaAPI = new AlpacaAPI();
   }
}
