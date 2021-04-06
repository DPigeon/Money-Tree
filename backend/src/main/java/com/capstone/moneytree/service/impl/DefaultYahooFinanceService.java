package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.facade.YahooFinanceFacade;
import com.capstone.moneytree.service.api.YahooFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class DefaultYahooFinanceService implements YahooFinanceService {

    @Autowired
    YahooFinanceFacade yahooFinanceFacade;

    @Override
    public Mono<String> getHistoricalGraphData(String ticker, String range, String interval) {
        return yahooFinanceFacade.getHistoricalGraphData(ticker, range, interval);
    }
}
