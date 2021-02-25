package com.capstone.moneytree.facade;


import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.capstone.moneytree.exception.BadRequestException;

import lombok.NoArgsConstructor;
import net.jacobpeterson.alpaca.AlpacaAPI;

/**
 * This Session is used to be able to build different Alpaca client for each user token
 */
@NoArgsConstructor
@Component
public class AlpacaSession {
   private static final Logger LOGGER = LoggerFactory.getLogger(AlpacaSession.class);

   /**
    * Utility method to instantiate a Alpaca client using the client's oauth token
    *
    * @return the alpaca client
    */
   public AlpacaAPI alpaca(String alpacaKey) {
      if (StringUtils.isBlank(alpacaKey)) {
         LOGGER.error("User token for alpaca api is blank!");
         throw new BadRequestException("User token for alpaca api is blank!");
      }
      return new AlpacaAPI(alpacaKey);
   }
}
