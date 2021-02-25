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
      .post('users/', user)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  updateUser(userId: number, newUserParams: User): Observable<User> {
    return this.api
      .patch('users/' + userId, newUserParams)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  getUser(id: number): Observable<User> {
    return this.api
      .get('users/' + id)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  userLogin(user: User): Observable<User> {
    return this.api
      .post('users/login', user)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  getOAuthAlpacaToken(userId: number, alpacaCode: string): Observable<User> {
    return this.api
      .post('users/' + userId + '/register-alpaca-key/' + alpacaCode, {})
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  deleteUserByEmail(email: string): Observable<any> {
    return this.api.delete('users/delete-by-email/' + email);
  }

  updatePictureURL(
    userId: number,
    imageFile: File,
    selection: string
  ): Observable<any> {
    const body = new FormData();
    body.append('imageFile', imageFile);
    body.append('selection', selection); // here selection must be either "avatarURL" or "coverPhotoURL"
    return this.api
      .post('users/profile-picture/' + userId.toString(), body)
      .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.api
      .get('users/followers/' + userId)
      .pipe(map((res: Response) => this.followUserListFormatter(res)));
  }

  getFollowings(userId: number): Observable<User[]> {
    return this.api
      .get('users/followings/' + userId)
      .pipe(map((res: Response) => this.followUserListFormatter(res)));
  }

  userFormatter(response: any): User {
    const formattedUser: User = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      avatarURL: response.avatarURL,
      coverPhotoURL: response.coverPhotoURL,
      email: response.email,
      score: response.score,
      rank: response.rank,
      balance: response.balance,
      alpacaApiKey: response.alpacaApiKey,
      portfolio: response.portfolio,
      transactions: response.transactions,
      biography: response.biography,
    };
    return formattedUser;
  }

  followUserListFormatter(response: any): User[] {
    const result: User[] = [];
    for (const fetchedUser of response.body) {
      result.push({
        id: fetchedUser.id,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        username: fetchedUser.username,
        avatarURL: fetchedUser.avatarURL,
        score: fetchedUser.score,
        rank: fetchedUser.rank,
        balance: fetchedUser.balance,
      });
    }
    return result;
  }
}
