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

    const thisL = this;
    thisL.stompClient.connect(
      {},
      (frame) => {
        thisL.stompClient.send("/app/trade/updates", {}, this.userId);
        thisL.stompClient.subscribe(topic, (sdkEvent) => {
          thisL.onMessageReceived(sdkEvent);
        }, err =>{
          console.log("WEBSOCKET ERROR", err);
        });
      },
      this.errorCallBack
    );
  }

  // Disconnects the user from the client and the backend
  disconnect(): void {
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
  errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
      console.log('should try to reconnect');
    }, 5000);
  }

  onMessageReceived(message): void {
    console.log('Message Recieved from Server :: ', JSON.parse(message.body));
    // will dispatch actions to the storeFacade when recieving messages
  }
}
