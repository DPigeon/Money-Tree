package com.capstone.moneytree.config

import org.junit.Test
import org.springframework.web.socket.messaging.WebSocketStompClient
import spock.lang.Specification

class WebSocketClientConfigTest extends Specification {

    @Test
    def "It should build a WebSocket client"() {
        when: "building a ws client"
        WebSocketStompClient wsClient = WebSocketClientConfig.buildClient()
        wsClient.start()

        then: "The client should be built"
        assert wsClient != null
        assert wsClient.isRunning()
        wsClient.stop()
    }
}
