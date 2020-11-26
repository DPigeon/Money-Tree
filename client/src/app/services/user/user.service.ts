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
      .pipe(map((res: Response) => this.userFormatter(res)));
  }

  userFormatter(response: Response) {
    let cuurentUser: User = {
      id: response.body['id'],
      firstName: response.body['firstName'],
      lastName: response.body['lastName'],
      username: response.body['username'],
      avatarUrl: response.body['avatarUrl'],
      email: response.body['email'],
      score: response.body['score'],
      rank: response.body['rank'],
      balance: response.body['balance'],
      // password: for security we don't want to get the password
      alpacaApiKey: response.body['alpacaApiKey'],
      // follows: User[]; // should this be added to backend?,
      followers: response.body['followers'],
      portfolio: response.body['portfolio'],
      transactions: response.body['transactions'],
    };
    return cuurentUser;
  }
  userLogin(user: User): Observable<User> {
    return this.api
      .post('users/login', user)
      .pipe(map((res: Response) => this.userFormatter(res)));
  }
}
