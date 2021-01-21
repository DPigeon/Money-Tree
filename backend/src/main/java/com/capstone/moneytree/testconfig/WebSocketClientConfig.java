package com.capstone.moneytree;

import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.util.Collections;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class WebSocketClientConfig {

    private static final String WS_ENDPOINT = "http://localhost:8080/api/v1/ws";

    public static WebSocketStompClient buildClient() {
        return new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(
                        new StandardWebSocketClient()))
        ));
    }

    public static StompSession createSession(int timeout) {
        WebSocketStompClient webSocketStompClient = buildClient();
        StompSession stompSession = null;
        try {
            stompSession = webSocketStompClient
                    .connect(WS_ENDPOINT, new StompSessionHandlerAdapter() {})
                    .get(timeout, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        }

        return stompSession;
    }
}
