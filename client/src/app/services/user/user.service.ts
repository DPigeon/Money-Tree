import { Injectable } from '@angular/core';
import { User, UserProfile } from 'src/app/interfaces/user';
import { UserSearch } from 'src/app/interfaces/userSearch';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataFormatter } from '../../utilities/data-formatters';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService, private dataFormatter: DataFormatter) {}

  createNewUser(user: User): Observable<User> {
    return this.api
      .post('users/', user)
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
  }

  updateUser(userId: number, newUserParams: User): Observable<User> {
    return this.api
      .patch('users/' + userId, newUserParams)
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
  }

  getUser(id: number): Observable<User> {
    return this.api
      .get('users/' + id)
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
  }

  followUser(followerId: number, userToFollowId: number): Observable<any> {
    return this.api.post(`users/${followerId}/follow/${userToFollowId}`);
  }

  unfollowUser(followerId: number, userToUnfollowId: number): Observable<any> {
    return this.api.delete(`users/${followerId}/unfollow/${userToUnfollowId}`);
  }

  // This method is used to get profile information, and will include all data for the user
  getUserByUsername(username: string): Observable<UserProfile> {
    return this.api
      .get('users/profile/' + username) // check if end point changes
      .pipe(
        map((res: Response) =>
          this.dataFormatter.userCompleteProfileFormatter(res.body)
        )
      );
  }

  getAllUsers(): Observable<UserSearch[]> {
    return this.api
      .get('users/search')
      .pipe(map((res: Response) => this.userSearchFormatter(res.body)));
  }

  userLogin(user: User): Observable<User> {
    return this.api
      .post('users/login', user)
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
  }

  getOAuthAlpacaToken(userId: number, alpacaCode: string): Observable<User> {
    return this.api
      .post('users/' + userId + '/register-alpaca-key/' + alpacaCode, {})
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
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
      .pipe(map((res: Response) => this.dataFormatter.userFormatter(res.body)));
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.api
      .get('users/followers/' + userId)
      .pipe(
        map((res: Response) => this.dataFormatter.followUserListFormatter(res))
      );
  }

  getFollowings(userId: number): Observable<User[]> {
    return this.api
      .get('users/followings/' + userId)
      .pipe(
        map((res: Response) => this.dataFormatter.followUserListFormatter(res))
      );
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
      // portfolio: response.portfolio,
      // transactions: response.transactions,
      biography: response.biography,
    };
    return formattedUser;
  }

  userSearchFormatter(response: any): UserSearch[] {
    let result: UserSearch[] = [];
    response.forEach((e) => {
      result.push({
        id: e.id,
        firstName: e.firstName,
        lastName: e.lastName,
        username: e.username,
        avatarURL: e.avatarURL,
        email: e.email,
      });
    });
    return result;
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
