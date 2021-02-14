package com.capstone.moneytree.service.api;

import reactor.core.publisher.Mono;

public interface YahooFinanceService {
    public Mono<String> getHistoricalGraphData(String ticker, String range, String interval);
}
