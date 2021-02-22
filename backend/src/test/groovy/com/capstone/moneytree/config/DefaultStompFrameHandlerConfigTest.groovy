package com.capstone.moneytree.config

import org.junit.Test
import spock.lang.Specification

import java.util.concurrent.BlockingQueue
import java.util.concurrent.LinkedBlockingDeque

class DefaultStompFrameHandlerConfigTest extends Specification {

    private DefaultStompFrameHandlerConfig defaultStompFrameHandler

    @Test
    def "It should initialize the STOMP frame handler"() {
        given: "The frame handler"
        BlockingQueue<String> blockingQueue = new LinkedBlockingDeque<>()

        when: "we initialize the frame handler"
        defaultStompFrameHandler = new DefaultStompFrameHandlerConfig(blockingQueue)

        then: "should be initialized"
        assert defaultStompFrameHandler != null
    }
}
