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

  deleteUserByEmail(email: string): Observable<any> {
    return this.api.delete('users/delete-by-email/' + email);
  }

  userFormatter(response: any): User {
    const formattedUser: User = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      avatarURL: response.avatarURL,
      email: response.email,
      score: response.score,
      rank: response.rank,
      balance: response.balance,
      alpacaApiKey: response.alpacaApiKey,
      follows: response.follows,
      followers: response.followers,
      portfolio: response.portfolio,
      transactions: response.transactions,
      biography: response.biography,
    };
    return formattedUser;
  }

  updateProfilePictureURL(userId: number, imageFile: File): Observable<any> {
    const body = new FormData();
    body.append('imageFile', imageFile);
    return this.api.update('users/profile-picture/' + userId.toString(), body);
  }
}
