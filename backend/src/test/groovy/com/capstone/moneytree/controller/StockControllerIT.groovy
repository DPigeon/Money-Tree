package com.capstone.moneytree.controller

import com.capstone.moneytree.facade.YahooFinanceFacade
import com.capstone.moneytree.service.api.YahooFinanceService
import com.capstone.moneytree.service.impl.DefaultYahooFinanceService
import org.junit.platform.commons.util.StringUtils
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles

import com.capstone.moneytree.facade.StockMarketDataFacade
import com.capstone.moneytree.service.api.StockMarketDataService
import com.capstone.moneytree.service.impl.DefaultStockMarketDataService

import pl.zankowski.iextrading4j.api.exception.IEXTradingException
import spock.lang.Ignore
import spock.lang.Specification

/**
 * Tests for the Stock Controller. Tests the StockMarketDataFacade as well. Tests the YahooFinance facade and service.
 * */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("dev")
class StockControllerIT extends Specification {

   private static final String PUBLISH_TOKEN = System.getenv().get("IEXCLOUD_PUBLISHABLE_TOKEN_SANDBOX")
   private static final String SECRET_TOKEN = System.getenv().get("IEXCLOUD_SECRET_TOKEN_SANDBOX")

   StockMarketDataFacade stockMarketDataFacade = new StockMarketDataFacade(PUBLISH_TOKEN, SECRET_TOKEN, "dev")
   StockMarketDataService stockMarketDataService = new DefaultStockMarketDataService(stockMarketDataFacade: stockMarketDataFacade)
   YahooFinanceFacade yahooFinanceFacade = new YahooFinanceFacade();
   YahooFinanceService yahooFinanceService = new DefaultYahooFinanceService(yahooFinanceFacade);
   StockController stockController = new StockController(stockMarketDataService, yahooFinanceService)

   @Ignore("Fails, needs to be fixed")
   def "Validates GET batch returns stock information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the batch endpoint is made"
      def res = stockController.getBatchStocksBySymbol(appl)

      then: "We get a valid Batch object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().company.symbol == appl
   }

   def "GET batch throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the batch endpoint is made"
      stockController.getBatchStocksBySymbol(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET book returns book information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the book endpoint is made"
      def res = stockController.getBook(appl)

      then: "We get a valid book object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
   }

   def "GET Book throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the book endpoint is made"
      stockController.getBook(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET quote returns quote information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the quote endpoint is made"
      def res = stockController.getQuote(appl)

      then: "We get a valid quote object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().symbol == appl
   }

   def "GET quote throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the batch quote is made"
      stockController.getQuote(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET companyInfo returns comapny information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the companyInfo endpoint is made"
      def res = stockController.getCompanyInfo(appl)

      then: "We get a valid companyInfo object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().symbol == appl
   }

   def "GET companyInfo throws IEXTrading Exception when symbol is not valid for that company"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the companyInfo endpoint is made"
      stockController.getCompanyInfo(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET last 5 News returns news for the given symbol"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the lastNNews endpoint is made"
      def res = stockController.getLastNNews(appl, 5)

      then: "We get a valid lastNNews object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().size() == 5
      assert StringUtils.isNotBlank(res.getBody().get(0).headline)
   }

   def "GET last N news throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the getLastNNews endpoint is made"
      stockController.getLastNNews(symbol, 5)

      then: "we get an exception"
      thrown(IEXTradingException)
   }

   def "GET last N news throws IEXTrading Exception when N is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the getLastNNews endpoint is made"
      stockController.getLastNNews(symbol, 0)

      then: "we get an exception"
      thrown(IEXTradingException)
   }

   @Ignore("Fails, needs to be fixed")
   def "Validates GET keyStats returns keyStats information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the keyStats endpoint is made"
      def res = stockController.getKeyStats(appl)

      then: "We get a valid keyStats object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().companyName == "Apple, Inc."
   }

   def "GET keyStats throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the keyStats endpoint is made"
      stockController.getKeyStats(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET chart for the DAY returns chart information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the chart endpoint is made"
      def res = stockController.getChart(appl, "DAY")

      then: "We get a valid chart object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
   }

   def "GET chart throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the chart endpoint is made"
      stockController.getChart(symbol, "")

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "GET chart default to YEAR range  when range is not provided"() {
      given: "A stock symbol"
      def symbol = "aapl"

      when: "A call to the chart endpoint is made"
      def res = stockController.getChart(symbol, "")

      then: "We get a valid chart object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
   }

   def "Validates GET logo returns logo information"() {
      given: "A stock symbol"
      def appl = "AAPL"

      when: "A call to the chart endpoint is made"
      def res = stockController.getLogo(appl)

      then: "We get a valid chart object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
      res.getBody().url != ""
   }

   def "GET logo throws IEXTrading Exception when symbol is not valid"() {
      given: "A stock symbol"
      def symbol = "invalid symbol"

      when: "A call to the logo endpoint is made"
      stockController.getLogo(symbol)

      then: "We get an exception"
      thrown(IEXTradingException)
   }

   def "Validates GET yahooChart returns chart information"() {
      given: "A stock symbol"
      def symbol = "AAPL"
      def range = "1d"
      def interval = "1m"

      when: "A call to the yahooChart endpoint is made"
      def res = stockController.getYahooChart(symbol, range, interval)

      then: "We get a valid chart object"
      res.statusCode == HttpStatus.OK
      res.getBody() != null
   }
}
