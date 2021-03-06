import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/app.reducer';
import * as appActions from './actions/app.actions';
import * as appSelectors from './selectors/app.selectors';
import { Observable } from 'rxjs';
import { Stock } from '../interfaces/stock';
import { User, UserProfile } from '../interfaces/user';
import { AppError } from '../interfaces/app-error';
import { MarketClock } from './../interfaces/market-clock';
import { Transaction } from '../interfaces/transaction';
import { UserSearch } from '../interfaces/userSearch';
import { StockPercentage } from '../interfaces/stock-percentage';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  currentStockLoaded$: Observable<Stock>;
  stockHistoricalDataLoaded$: Observable<any>;
  currentUser$: Observable<User>;
  currentProfileUser$: Observable<UserProfile>;
  appError$: Observable<AppError>;
  shouldAlpacaRedirect$: Observable<boolean>;
  isUserLoggedIn$: Observable<boolean>;
  authenticationInformation$: Observable<{
    userExists: boolean;
    hasAlpacaCode: boolean;
  }>;
  currentMarketClock$: Observable<MarketClock>;
  currentFollowings$: Observable<User[]>;
  currentFollowers$: Observable<User[]>;
  userTransactions$: Observable<Transaction[]>;
  userOwnedStocks$: Observable<Stock[]>;
  userSearch$: Observable<UserSearch[]>;
  leaderboardUsers$: Observable<User[]>;
  userAlpacaPositions$: Observable<AlpacaUserPosition[]>;
  topInvestorsOnAStock$: Observable<User[]>;
  followersWithSameStock$: Observable<User[]>;
  stocksOwnedByUsersOwnThisStock$: Observable<StockPercentage[]>;

  constructor(private store: Store<{ appState: State }>) {
    this.currentStockLoaded$ = this.store.select(
      appSelectors.selectCurrentStock
    );
    this.stockHistoricalDataLoaded$ = this.store.select(
      appSelectors.selectStockHistoricalData
    );
    this.currentUser$ = this.store.select(appSelectors.selectCurrentUser);
    this.appError$ = this.store.select(appSelectors.selectAppError);
    this.shouldAlpacaRedirect$ = this.store.select(
      appSelectors.selectShouldAlpacaRedirect
    );
    this.isUserLoggedIn$ = this.store.select(appSelectors.isUserLoggedIn);
    this.authenticationInformation$ = this.store.select(
      appSelectors.selectAuthenticationInformation
    );
    this.currentMarketClock$ = this.store.select(
      appSelectors.selectCurrentMarketClock
    );
    this.currentFollowers$ = this.store.select(
      appSelectors.selectCurrentFollowers
    );
    this.currentFollowings$ = this.store.select(
      appSelectors.selectCurrentFollowings
    );
    this.userTransactions$ = this.store.select(
      appSelectors.selectUserTransactions
    );
    this.userOwnedStocks$ = this.store.select(
      appSelectors.selectUserOwnedStocks
    );
    this.currentProfileUser$ = this.store.select(
      appSelectors.selectCurrentLoadedProfile
    );
    this.userSearch$ = this.store.select(appSelectors.selectUserSearchList);
    this.leaderboardUsers$ = this.store.select(
      appSelectors.selectLeaderboardUsers
    );
    this.userAlpacaPositions$ = this.store.select(
      appSelectors.selectAlpacaPositions
    );
    this.topInvestorsOnAStock$ = this.store.select(
      appSelectors.selectTopInvestorsOnAStock
    );
    this.followersWithSameStock$ = this.store.select(
      appSelectors.selectFollowersWithSameStock
    );
    this.stocksOwnedByUsersOwnThisStock$ = this.store.select(
      appSelectors.selectStocksOwnedByUsersOwnThisStock
    );
  }

  loadCurrentStock(ticker: string): void {
    this.store.dispatch(appActions.loadStockInfo({ stockTicker: ticker }));
  }

  loadMarketClock(userId: number): void {
    this.store.dispatch(appActions.loadMarketClock({ userId }));
  }

  loadCurrentStockHistoricalData(
    ticker: string,
    range: string,
    interval: string
  ): void {
    this.store.dispatch(
      appActions.loadStockHistoricalData({
        stockTicker: ticker,
        chartRange: range,
        chartInterval: interval,
      })
    );
  }

  createNewUser(user: User): void {
    this.store.dispatch(appActions.createNewUser({ user }));
  }

  userLogin(user: User): void {
    this.store.dispatch(appActions.userLogin({ user }));
  }

  updateUser(user: User): void {
    this.store.dispatch(appActions.upadateUser({ user }));
  }

  getAlpacaOAuthToken(userId: number, alpacaToken: string): void {
    this.store.dispatch(
      appActions.getAlpacaOAuthToken({ userId, alpacaToken })
    );
  }

  getCurrentUser(userId: number): void {
    this.store.dispatch(appActions.getCurrentUser({ id: userId }));
  }

  loadCurrentUserFollowers(userId: number): void {
    this.store.dispatch(appActions.loadCurrentUserFollowers({ id: userId }));
  }
  loadCurrentUserFollowings(userId: number): void {
    this.store.dispatch(appActions.loadCurrentUserFollowings({ id: userId }));
  }

  loadUserSearchList(): void {
    this.store.dispatch(appActions.loadUserSearchList());
  }

  logCurrentUserOut(): void {
    this.store.dispatch(appActions.logCurrentUserOut());
  }

  updatePictureURL(userId: number, imageFile: File, selection: string): void {
    this.store.dispatch(
      appActions.updatePictureURL({
        id: userId,
        image: imageFile,
        typeSelection: selection,
      })
    );
  }
  processStockTransaction(transaction: Transaction, userId: number): void {
    this.store.dispatch(
      appActions.processStockTransaction({ transaction, userId })
    );
  }
  loadUserTransactions(userId: number): void {
    this.store.dispatch(appActions.loadUserTransactions({ userId }));
  }
  loadUserOwnedStocks(userId: number): void {
    this.store.dispatch(appActions.loadUserOwnedStocks({ userId }));
  }
  loadCurrentProfileUser(username: string): void {
    this.store.dispatch(appActions.loadUserProfile({ username }));
  }

  followUser(followerId: number, userToFollowId: number): void {
    this.store.dispatch(appActions.followUser({ followerId, userToFollowId }));
  }

  unfollowUser(followerId: number, userToUnfollowId: number): void {
    this.store.dispatch(
      appActions.unfollowUser({ followerId, userToUnfollowId })
    );
  }

  loadLeaderboardUsers(): void {
    this.store.dispatch(appActions.loadLeaderboardUsers());
  }

  loadAlpacaPositions(userId: number): void {
    this.store.dispatch(appActions.loadAlpacaPositions({ userId }));
  }

  loadTopInvestorsOnAStock(stockSymbol: string): void {
    this.store.dispatch(
      appActions.loadTopInvestorsOnAStock({ symbol: stockSymbol })
    );
  }
  loadFollowersWithSameStock(id: number, stockSymbol: string): void {
    this.store.dispatch(
      appActions.loadFollowersWithSameStock({ userId: id, symbol: stockSymbol })
    );
  }

  loadStocksOwnedByUsersOwnThisStock(thisStockSymbol: string): void {
    this.store.dispatch(
      appActions.loadStocksOwnedByUsersOwnThisStock({ symbol: thisStockSymbol })
    );
  }
}
