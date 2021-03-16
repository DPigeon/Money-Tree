import { Injectable } from '@angular/core';
import { User, UserProfile } from 'src/app/interfaces/user';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dataFormatter } from '../../utilities/data-formatters'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService, private dataFormatter: dataFormatter) { }

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

  // This method is used to get profile information, and will include all data for the user
  getUserByUsername(username: string): Observable<UserProfile> {
    return this.api
      .get('users/profile/' + username) // check if end point changes
      .pipe(map((res: Response) => this.dataFormatter.userCompleteProfileFormatter(res.body)));
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
      .pipe(map((res: Response) => this.dataFormatter.followUserListFormatter(res)));
  }

  getFollowings(userId: number): Observable<User[]> {
    return this.api
      .get('users/followings/' + userId)
      .pipe(map((res: Response) => this.dataFormatter.followUserListFormatter(res)));
  }

}
