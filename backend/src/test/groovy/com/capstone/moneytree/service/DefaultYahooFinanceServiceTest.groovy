package com.capstone.moneytree.service

import com.capstone.moneytree.facade.YahooFinanceFacade
import com.capstone.moneytree.service.api.YahooFinanceService
import com.capstone.moneytree.service.impl.DefaultYahooFinanceService
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import spock.lang.Specification

class DefaultYahooFinanceServiceTest extends Specification {

    YahooFinanceFacade yahooFinanceFacade = new YahooFinanceFacade(WebClient.builder());
    YahooFinanceService yahooFinanceService = new DefaultYahooFinanceService(yahooFinanceFacade: yahooFinanceFacade);

    def "Should get historical graph data"() {
        given: "The information"
        String ticker = "TSLA"
        String range = "2d"
        String interval = "3m"

        when: "Getting the data"
        Mono<String> response = yahooFinanceService.getHistoricalGraphData(ticker, range, interval)

        then: "Should get the data"
        assert response != null
    }
}
