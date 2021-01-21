package com.capstone.moneytree;

import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;

import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;

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
        blockingQueue.offer(new String((byte[]) object));
    }
}
