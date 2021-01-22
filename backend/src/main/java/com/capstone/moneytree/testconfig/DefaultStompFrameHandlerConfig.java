package com.capstone.moneytree.testconfig;

import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;

import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;

/**
 * Used for the WebSocket integration tests for the TCP frame handler protocol
 */

public class DefaultStompFrameHandlerConfig implements StompFrameHandler {

    private final BlockingQueue<String> blockingQueue;

    public DefaultStompFrameHandlerConfig(BlockingQueue<String> blockingQueue) {
        this.blockingQueue = blockingQueue;
    }

    @Override
    public Type getPayloadType(StompHeaders stompHeaders) {
        return byte[].class;
    }

    @Override
    public void handleFrame(StompHeaders stompHeaders, Object object) {
        boolean offer = blockingQueue.offer(new String((byte[]) object));
        System.out.println("Queue Offer: " + offer);
    }
}
