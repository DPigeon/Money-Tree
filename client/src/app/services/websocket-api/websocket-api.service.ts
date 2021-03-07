import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreFacadeService } from '../../store/store-facade.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WebsocketAPIService {
  webSocketEndPoint: string = environment.websocketURL;
  stompClient: any;
  userId: number;
  stompSubscription: any;

  // count variable to used to debug an issue with recieving multiple server messages in 1 call
  // to be investigated more in a separate story
  count = 0;

  constructor(
    private snackBar: MatSnackBar,
    private storeFacade: StoreFacadeService,
    private router: Router
  ) {}

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
        thisL.stompClient.send('/app/trade/updates', {}, this.userId);
        this.stompSubscription = thisL.stompClient.subscribe(
          topic,
          (sdkEvent) => {
            thisL.onMessageReceived(sdkEvent);
          },
          (err) => {
            console.log('WEBSOCKET ERROR', err);
          }
        );
      },
      this.errorCallBack
    );
  }

  // Disconnects the user from the client and the backend
  disconnect(): void {
    if (this.stompClient !== null && this.userId) {
      this.stompClient.send('/app/trade/disconnect', {}, this.userId);
      this.stompSubscription.unsubscribe();
      this.stompClient.send(
        '/app/trade/disconnect',
        { userId: this.userId },
        'Disconnect UserId: ' + this.userId
      );
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
    this.count += 1;

    console.log('Message Recieved from Server :: ', message.body);
    if (this.userId && message && message.body && message.body) {
      const snackBarRef = this.snackBar.open(
        'The status of one of your orders has been updated',
        'View',
        { duration: 5000 }
      );
      snackBarRef.onAction().subscribe(() => {
        // currently the profile page does not exist but when it does, it will guide the users there
        // this.router.navigate(['profile'])
      });
      this.storeFacade.getCurrentUser(this.userId);
    }
    console.log('COUNT DEBUG: ', this.count);
  }
}
