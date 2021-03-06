import { Injectable } from '@angular/core';
import { User, UserProfile } from 'src/app/interfaces/user';
import { UserSearch } from 'src/app/interfaces/userSearch';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataFormatter } from '../../utilities/data-formatters';
import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { StockHistory } from 'src/app/interfaces/stockHistory';

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
      .pipe(
        map((res: Response) => this.dataFormatter.userSearchFormatter(res.body))
      );
  }

  getUserAlpacaPosition(userId: number): Observable<AlpacaUserPosition[]> {
    return this.api
      .get('alpaca/positions/' + userId)
      .pipe(
        map((res: Response) =>
          this.dataFormatter.alpacaUserPositionFormatter(res.body)
        )
      );
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

  getLeaderBoard(): Observable<User[]> {
    return this.api
      .get('users/leaderboard')
      .pipe(map((res: Response) => this.dataFormatter.userListFormatter(res)));
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
      .pipe(map((res: Response) => this.dataFormatter.userListFormatter(res)));
  }

  getFollowings(userId: number): Observable<User[]> {
    return this.api
      .get('users/followings/' + userId)
      .pipe(map((res: Response) => this.dataFormatter.userListFormatter(res)));
  }

  getTopInvestors(symbol: string): Observable<User[]> {
    return this.api
      .get('users/' + symbol + '/top')
      .pipe(map((res: Response) => this.dataFormatter.userListFormatter(res)));
  }

  getFollowersWithSameStock(
    userId: number,
    symbol: string
  ): Observable<User[]> {
    return this.api
      .get(`users/${userId}/owned_by_followers/${symbol}`)
      .pipe(map((res: Response) => this.dataFormatter.userListFormatter(res)));
  }

  getPortfolioHistoricalData(
    userId: string,
    periodLength: number,
    periodUnit: string,
    timeFrame: string,
    dateEnd: string,
    extendedHours: string
  ): Observable<StockHistory> {
    return this.api
      .get(
        'alpaca/portfolio/userId=' +
          userId +
          '&period=' +
          periodLength +
          '&unit=' +
          periodUnit +
          '&timeframe=' +
          timeFrame +
          '&dateend=' +
          dateEnd +
          '&extended=' +
          extendedHours
      )
      .pipe(
        map((res: Response) =>
          this.dataFormatter.formatAlpacaPortfolio(res.body)
        )
      );
  }

}
