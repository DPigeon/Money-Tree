package com.capstone.moneytree.facade;


import com.capstone.moneytree.handler.ExceptionMessage;
import net.jacobpeterson.alpaca.enums.api.DataAPIType;
import net.jacobpeterson.alpaca.enums.api.EndpointAPIType;
import net.jacobpeterson.alpaca.properties.AlpacaProperties;
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
   public AlpacaAPI alpaca(String userId, String alpacaKey) {
      if (alpacaKey.isBlank()) {
         LOGGER.error(ExceptionMessage.ALPACA_TOKEN_BLANK.getMessage());
         throw new BadRequestException(ExceptionMessage.ALPACA_TOKEN_BLANK.getMessage());
      }
      LOGGER.info("Creating an Alpaca Session to user ID {}", userId);
      return new AlpacaAPI(null, null, alpacaKey, EndpointAPIType.PAPER, DataAPIType.IEX);
   }
}
