import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/app.reducer';
import * as appActions from './actions/app.actions';
import * as appSelectors from './selectors/app.selectors';
import { Observable } from 'rxjs';
import { Stock } from '../interfaces/stock';
import { User } from '../interfaces/user';
import { AppError } from '../interfaces/app-error';
import { MarketClock } from './../interfaces/market-clock';
import { Transaction } from '../interfaces/transaction';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  currentStockLoaded$: Observable<Stock>;
  currentUser$: Observable<User>;
  appError$: Observable<AppError>;
  shouldAlpacaRedirect$: Observable<boolean>;
  isUserLoggedIn$: Observable<boolean>;
  authenticationInformation$: Observable<{
    userExists: boolean;
    hasAlpacaCode: boolean;
  }>;
  currentMarketClock$: Observable<MarketClock>;

  constructor(private store: Store<{ appState: State }>) {
    this.currentStockLoaded$ = this.store.select(
      appSelectors.selectCurrentStock
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
  }

  loadCurrentStock(ticker: string): void {
    this.store.dispatch(appActions.loadStockInfo({ stockTicker: ticker }));
  }

  loadMarketClock(): void {
    this.store.dispatch(appActions.loadMarketClock());
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
  processStockTransaction(transaction: Transaction): void {
    this.store.dispatch(appActions.processStockTransaction({ transaction }))
  }
}
