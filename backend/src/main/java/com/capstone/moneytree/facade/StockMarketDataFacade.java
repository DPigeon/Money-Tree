package com.capstone.moneytree.facade;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pl.zankowski.iextrading4j.api.stocks.*;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;
import pl.zankowski.iextrading4j.api.stocks.v1.News;
import pl.zankowski.iextrading4j.api.stocks.v1.BatchStocks;
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

    @Autowired
    public StockMarketDataFacade(@Value("${IEXCloud.publishable.token}") String pToken, @Value("${IEXCloud.secret.token}") String sToken) {
        stockMarketDataClient = IEXTradingClient.create(IEXTradingApiVersion.IEX_CLOUD_STABLE_SANDBOX,
                new IEXCloudTokenBuilder()
                        .withPublishableToken(pToken)
                        .withSecretToken(sToken)
                        .build());
    }

    public BatchStocks getBatchStocksBySymbol(String symbol) {
        return stockMarketDataClient.executeRequest(new BatchStocksRequestBuilder()
                .withSymbol(symbol)
                .addType(BatchStocksType.BOOK)
                .addType(BatchStocksType.COMPANY)
                .addType(BatchStocksType.NEWS).withLast(10)
                .addType(BatchStocksType.KEY_STATS)
                .addType(BatchStocksType.LOGO)
                .addType(BatchStocksType.CHART)
                .build()
        );
    }

    public Book getBook(String symbol) {
        return stockMarketDataClient.executeRequest(new BookRequestBuilder()
                .withSymbol(symbol)
                .build());
    }

    public Quote getQuote(String symbol) {
        return stockMarketDataClient.executeRequest(new QuoteRequestBuilder()
                .withSymbol(symbol)
                .build());
    }

    public Company getCompanyInfo(String symbol) {
        return stockMarketDataClient.executeRequest(new CompanyRequestBuilder()
                .withSymbol(symbol)
                .build());
    }

    public List<News> getLastNNews(String symbol, int lastN) {
        return stockMarketDataClient.executeRequest(new NewsRequestBuilder()
                .withSymbol(symbol)
                .withLast(lastN)
                .build());
    }

    public KeyStats getKeyStats(String symbol) {
        return stockMarketDataClient.executeRequest(new KeyStatsRequestBuilder()
                .withSymbol(symbol)
                .build());
    }

    public List<Chart> getChart(String symbol, String range) {

        if (StringUtils.isBlank(range)) {
            return stockMarketDataClient.executeRequest(new ChartRequestBuilder()
                    .withSymbol(symbol)
                    .withChartRange(ChartRange.YEAR_TO_DATE)
                    .build());
        }
        ChartRange chartRange;
        switch (range) {
            case "DAY":
                chartRange = ChartRange.ONE_DAY;
                break;
            case "WEEK":
                chartRange = ChartRange.FIVE_DAYS;
                break;
            case "MONTH":
                chartRange = ChartRange.ONE_MONTH;
                break;
            case "YEAR":
                chartRange = ChartRange.ONE_YEAR;
                break;
            default:
                chartRange = ChartRange.YEAR_TO_DATE;
        }

        return stockMarketDataClient.executeRequest(new ChartRequestBuilder()
                .withSymbol(symbol)
                .withChartRange(chartRange)
                .build());
    }

    public Logo getLogo(String symbol) {
        return stockMarketDataClient.executeRequest(new LogoRequestBuilder()
                .withSymbol(symbol)
                .build());
    }
}