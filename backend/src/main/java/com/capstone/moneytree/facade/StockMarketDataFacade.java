package com.capstone.moneytree.facade;


import com.capstone.moneytree.controller.StockController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import pl.zankowski.iextrading4j.api.stocks.Quote;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.client.IEXCloudClient;
import pl.zankowski.iextrading4j.client.IEXCloudTokenBuilder;
import pl.zankowski.iextrading4j.client.IEXTradingApiVersion;
import pl.zankowski.iextrading4j.client.IEXTradingClient;
import pl.zankowski.iextrading4j.client.rest.manager.RestRequest;
import pl.zankowski.iextrading4j.client.rest.request.IEXCloudV1RestRequest;
import pl.zankowski.iextrading4j.client.rest.request.stocks.QuoteRequestBuilder;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.BatchStocksRequestBuilder;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.BatchStocksType;

import java.util.List;


/**
 * This facade abstracts the IEXCloud API and exposes only the relevant
 * methods for MoneyTree.
 */
@Component
public class StockMarketDataFacade {

   private final IEXCloudClient stockMarketDataClient;
   private static final Logger LOG = LoggerFactory.getLogger(StockMarketDataFacade.class);

   // controller -> service -> facade -> api

   @Autowired
   public StockMarketDataFacade(@Value("${IEXCloud.publishable.token}") String PUBLISH_TOKEN, @Value("${IEXCloud.secret.token}") String SECRET_TOKEN) {
      stockMarketDataClient = IEXTradingClient.create(IEXTradingApiVersion.IEX_CLOUD_V1,
              new IEXCloudTokenBuilder()
                      .withPublishableToken(PUBLISH_TOKEN)
                      .withSecretToken(SECRET_TOKEN)
                .build());
   }

   public Quote getQuote(String symbol) {
      final Quote quote = stockMarketDataClient.executeRequest(new QuoteRequestBuilder()
              .withSymbol(symbol)
              .build());

      LOG.info("Fetched quote: {}", quote.toString());
      return quote;
   }

   public BatchStocks getBatchStocksBySymbols(String symbols) {
      final BatchStocks batchStocks = stockMarketDataClient.executeRequest(new BatchStocksRequestBuilder()
              .withSymbol(symbols)
              .addType(BatchStocksType.COMPANY)
              .addType(BatchStocksType.QUOTE)
              .addType(BatchStocksType.PRICE)
              .addType(BatchStocksType.NEWS)
              .build()
      );
      LOG.info("Fetch batch: {}", batchStocks.getCompany().getSymbol());
      return batchStocks;
   }
}
