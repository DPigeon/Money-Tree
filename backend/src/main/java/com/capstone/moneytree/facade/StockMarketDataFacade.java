package com.capstone.moneytree.facade;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import pl.zankowski.iextrading4j.client.IEXCloudClient;
import pl.zankowski.iextrading4j.client.IEXCloudTokenBuilder;
import pl.zankowski.iextrading4j.client.IEXTradingApiVersion;
import pl.zankowski.iextrading4j.client.IEXTradingClient;


/**
 * This facade abstracts the IEXCloud API and exposes only the relevant
 * methods for MoneyTree.
 */
@Component
public class StockMarketDataFacade {

   @Value("${IEXCloud.publishable.token}")
   private String PUBLISH_TOKEN;

   @Value("${IEXCloud.secret.token}")
   private String SECRET_TOKEN;

   private final IEXCloudClient stockMarketDataClient;

   @Autowired
   public StockMarketDataFacade() {
      this.stockMarketDataClient = IEXTradingClient.create(IEXTradingApiVersion.IEX_CLOUD_V1,
              new IEXCloudTokenBuilder()
                      .withPublishableToken(PUBLISH_TOKEN)
                      .withSecretToken(SECRET_TOKEN)
                      .build());
   }
}
