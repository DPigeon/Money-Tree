package com.capstone.moneytree;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Registers the asynchronous endpoint websockets messages
     * withSockJS is enabled for fallback options if websockets are not available in the browser
     * @param registry The STOMP endpoint registry
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200", "http://127.0.0.1", "https://127.0.0.1") // Replace with "*" to test with other clients
                .withSockJS();
    }

    /**
     * Config to subscribe to a topic when connected
     * Three SimpleBrokers are supported: "topic", "queue" & "user"
     * @param registry The message broker registry
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app")
                .enableSimpleBroker("/queue");
    }
}
