package com.capstone.moneytree.service.api;

import reactor.core.publisher.Mono;

public interface YahooFinanceService {

    Mono<String> getHistoricalGraphData(String ticker, String range, String interval);
}
