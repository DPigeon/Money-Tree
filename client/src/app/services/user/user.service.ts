import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  createNewUser(user: User): Observable<User> {
    return this.api
      .post('users/create-user', user)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  // This will be removed for a more generic update function
  updateAlpacaCode(userId: number, alpacaCode: string): Observable<User> {
    return this.api
      .post('users/' + userId + '/register-alpaca-key/' + alpacaCode, {})
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  getUser(id: number) {
    return this.api
      .get('users/' + id)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  userLogin(user: User): Observable<User> {
    return this.api
      .post('users/login', user)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  userFormatter(response: any) {
    console.log('user', response);
    let formattedUser: User = {
      id: response['id'],
      firstName: response['firstName'],
      lastName: response['lastName'],
      username: response['username'],
      avatarUrl: response['avatarUrl'],
      email: response['email'],
      score: response['score'],
      rank: response['rank'],
      balance: response['balance'],
      alpacaApiKey: response['alpacaApiKey'],
      follows: response['follows'],
      followers: response['followers'],
      portfolio: response['portfolio'],
      transactions: response['transactions'],
    };
    return formattedUser;
  }
}
