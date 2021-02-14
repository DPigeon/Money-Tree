package com.capstone.moneytree.facade;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class YahooFinanceFacade {

    private final WebClient webClient;

    public YahooFinanceFacade(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://query1.finance.yahoo.com").build();
    }

    public Mono<String> getHistoricalGraphData(String ticker, String range, String interval) {
        return this.webClient.get().uri("/v8/finance/chart/{ticker}?range={range}&interval={interval}", ticker, range, interval)
                .retrieve().bodyToMono(String.class);
    }
}
