import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketAPIService {
  webSocketEndPoint: string = environment.websocketURL;
  stompClient: any;
  userId: number;

  constructor() {}

  setWebsocketUserId(userId: number): void {
    this.userId = userId;
  }

  connect(): void {
    console.log('Initialize WebSocket Connection');
    const topic = '/queue/user-' + this.userId;
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      function (frame) {
        _this.stompClient.subscribe(topic, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        });
      },
      this.errorCallBack
    );
  }

  // Disconnects the user from the client and the backend
  disconnect() {
    if (this.stompClient !== null && this.userId) {
      this.stompClient.send(
        '/app/trade/disconnect',
        { userId: this.userId },
        'Disconnect UserId: ' + this.userId
      );
      this.stompClient.disconnect();
      this.userId = null;
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
      console.log('should try to reconnect');
    }, 5000);
  }

  onMessageReceived(message) {
    console.log('Message Recieved from Server :: ', message);
    // will dispatch actions to the storeFacade when recieving messages
  }
}
