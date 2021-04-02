package com.capstone.moneytree.service

import com.capstone.moneytree.facade.StockMarketDataFacade
import com.capstone.moneytree.service.api.StockMarketDataService
import com.capstone.moneytree.service.impl.DefaultStockMarketDataService
import pl.zankowski.iextrading4j.client.IEXCloudTokenBuilder
import pl.zankowski.iextrading4j.client.IEXTradingApiVersion
import pl.zankowski.iextrading4j.client.IEXTradingClient
import spock.lang.Specification;

/**
 * This class is used to test all basic implementation for the StockMarketDataService Service.
 */
class DefaultStockMarketDataServiceTest extends Specification {

    StockMarketDataFacade stockMarketDataFacade = Mock()
    StockMarketDataService stockMarketDataService = new DefaultStockMarketDataService(stockMarketDataFacade: stockMarketDataFacade)

    def "Should use the IEXCloud API Prod version when needed"() {
        given: "keys"
        String pToken = "pToken"
        String sToken = "sToken"

        when:
        StockMarketDataFacade stockMarketDataFacadeProd = new StockMarketDataFacade(pToken, sToken, "prod")

        then:
        stockMarketDataFacadeProd != null
    }

    def "Should get batch stocks by symbol by calling the facade once"() {
        given:
        String symbol = "TSLA"

        when:
        stockMarketDataService.getBatchStocksBySymbol(symbol)

        then:
        1 * stockMarketDataFacade.getBatchStocksBySymbol(symbol)
    }

    def "Should get book by calling the facade once"() {
        given:
        String symbol = "TSLA"

        when:
        stockMarketDataService.getBook(symbol)

        then:
        1 * stockMarketDataFacade.getBook(symbol)
    }

    def "Should get quote by calling the facade once"() {
        given:
        String symbol = "TSLA"

        when:
        stockMarketDataService.getQuote(symbol)

        then:
        1 * stockMarketDataFacade.getQuote(symbol)
    }

    def "Should get company info by calling the facade once"() {
        given:
        String symbol = "AAPL"

        when:
        stockMarketDataService.getCompanyInfo(symbol)

        then:
        1 * stockMarketDataFacade.getCompanyInfo(symbol)
    }

    def "Should get last news by calling the facade once"() {
        given:
        String symbol = "TSLA"
        int lastNews = 2;

        when:
        stockMarketDataService.getLastNNews(symbol, lastNews)

        then:
        1 * stockMarketDataFacade.getLastNNews(symbol, lastNews)
    }

    def "Should get key stats by calling the facade once"() {
        given:
        String symbol = "TSLA"

        when:
        stockMarketDataService.getKeyStats(symbol)

        then:
        1 * stockMarketDataFacade.getKeyStats(symbol)
    }

    def "Should get chart by calling the facade once"() {
        given:
        String symbol = "TSLA"
        String range = "1m"

        when:
        stockMarketDataService.getChart(symbol, range)

        then:
        1 * stockMarketDataFacade.getChart(symbol, range)
    }

    def "Should get logo by calling the facade once"() {
        given:
        String symbol = "AAPL"

        when:
        stockMarketDataService.getLogo(symbol)

        then:
        1 * stockMarketDataFacade.getLogo(symbol)
    }
}
