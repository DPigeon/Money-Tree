import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/app.reducer';
import * as appActions from './actions/app.actions';
import * as appSelectors from './selectors/app.selectors';
import { Observable } from 'rxjs';
import { Stock } from '../interfaces/stock';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class StoreFacadeService {
  currentStockLoaded$: Observable<Stock>;
  currentUser$: Observable<User>;
  appError$: Observable<any>; // the any should be changed to an Error standard
  shouldAlpacaRedirect$: Observable<boolean>;
  isUserLoggedIn$: Observable<boolean>;

  constructor(private store: Store<{ appState: State }>) {
    this.currentStockLoaded$ = this.store.select(
      appSelectors.selectCurrentStock
    );
    this.currentUser$ = this.store.select(appSelectors.selectCurrentUser);
    this.appError$ = this.store.select(appSelectors.selectAppError);
    this.shouldAlpacaRedirect$ = this.store.select(appSelectors.selectShouldAlpacaRedirect);
    this.isUserLoggedIn$ = this.store.select(appSelectors.isUserLoggedIn);
  }

  loadCurrentStock(ticker: string): void {
    this.store.dispatch(appActions.loadStockInfo({ stockTicker: ticker }));
  }

  createNewUser(user: User): void {
    this.store.dispatch(appActions.createNewUser({ user: user }));
  }

  userLogin(user: User): void {
    this.store.dispatch(appActions.userLogin({ user: user }));
  }

  updateUser(user: User): void {
    this.store.dispatch(appActions.upadateUser({user: user}));
  }
}
