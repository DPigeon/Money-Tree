package com.capstone.moneytree.facade;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pl.zankowski.iextrading4j.api.stocks.*;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
import pl.zankowski.iextrading4j.api.stocks.v1.News;
import pl.zankowski.iextrading4j.client.IEXCloudClient;
import pl.zankowski.iextrading4j.client.IEXCloudTokenBuilder;
import pl.zankowski.iextrading4j.client.IEXTradingApiVersion;
import pl.zankowski.iextrading4j.client.IEXTradingClient;
import pl.zankowski.iextrading4j.client.rest.request.stocks.*;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.BatchStocksRequestBuilder;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.BatchStocksType;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.KeyStatsRequestBuilder;
import pl.zankowski.iextrading4j.client.rest.request.stocks.v1.NewsRequestBuilder;

import java.util.List;

/**
 * This facade abstracts the IEXCloud API and exposes only the relevant
 * methods for MoneyTree.
 */
@Component
public class StockMarketDataFacade {

   private final IEXCloudClient stockMarketDataClient;
   private static final Logger LOG = LoggerFactory.getLogger(StockMarketDataFacade.class);

   @Autowired
   public StockMarketDataFacade(@Value("${IEXCloud.publishable.token}") String PUBLISH_TOKEN, @Value("${IEXCloud.secret.token}") String SECRET_TOKEN) {
      stockMarketDataClient = IEXTradingClient.create(IEXTradingApiVersion.IEX_CLOUD_V1,
              new IEXCloudTokenBuilder()
                      .withPublishableToken(PUBLISH_TOKEN)
                      .withSecretToken(SECRET_TOKEN)
                .build());
   }

   public BatchStocks getBatchStocksBySymbol(String symbol) {
      final BatchStocks batchStocks = stockMarketDataClient.executeRequest(new BatchStocksRequestBuilder()
              .withSymbol(symbol)
              .addType(BatchStocksType.BOOK)
              .addType(BatchStocksType.COMPANY)
              .addType(BatchStocksType.NEWS).withLast(10)
              .addType(BatchStocksType.KEY_STATS)
              .addType(BatchStocksType.LOGO)
              .addType(BatchStocksType.CHART)
              .build()
      );

      LOG.info("Fetch batch: {}", batchStocks.toString());
      return batchStocks;
   }

   public Book getBook(String symbol) {
      final Book book = stockMarketDataClient.executeRequest(new BookRequestBuilder()
              .withSymbol(symbol)
              .build());

      LOG.info("Fetched book: {}", book.toString());
      return book;
   }

   public Quote getQuote(String symbol) {
      final Quote quote = stockMarketDataClient.executeRequest(new QuoteRequestBuilder()
              .withSymbol(symbol)
              .build());

      LOG.info("Fetched quote: {}", quote.toString());
      return quote;
   }

   public Company getCompanyInfo(String symbol) {
      final Company company = stockMarketDataClient.executeRequest(new CompanyRequestBuilder()
         .withSymbol(symbol)
         .build());

      LOG.info("Fetched company: {}", company.toString());
      return company;
   }

   public List<News> getLastNNews(String symbol, int lastN) {
      final List<News> news = stockMarketDataClient.executeRequest(new NewsRequestBuilder()
              .withSymbol(symbol)
              .withLast(lastN)
              .build());

      for (News n : news) {
         LOG.info("Fetched news: {}", n.toString());
      }
      return news;
   }

   public KeyStats getKeyStats(String symbol) {
      final KeyStats keyStats = stockMarketDataClient.executeRequest(new KeyStatsRequestBuilder()
         .withSymbol(symbol)
         .build());

      LOG.info("Fetched key stats: {}", keyStats.toString());
      return keyStats;
   }

   public List<Chart> getChart(String symbol, String range) {

      ChartRange chartRange = ChartRange.YEAR_TO_DATE;
      if (range.equals("DAY"))
         chartRange = ChartRange.ONE_DAY;
      else if (range.equals("WEEK"))
         chartRange = ChartRange.FIVE_DAYS;
      else if (range.equals("MONTH"))
         chartRange = ChartRange.ONE_MONTH;
      else if (range.equals("YEAR"))
         chartRange = ChartRange.ONE_YEAR;

      final List<Chart> charts = stockMarketDataClient.executeRequest(new ChartRequestBuilder()
              .withSymbol(symbol)
              .withChartRange(chartRange)
              .build());

      LOG.info("Fetched charts: {}", charts.toString());
      return charts;
   }

   public Logo getLogo(String symbol) {
      final Logo logo = stockMarketDataClient.executeRequest(new LogoRequestBuilder()
              .withSymbol(symbol)
              .build());

      LOG.info("Fetched logo: {}", logo.toString());
      return logo;
   }
}
