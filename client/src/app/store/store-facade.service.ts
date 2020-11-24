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
  appError$: Observable<any>; // to be changed

  constructor(private store: Store<{ appState: State }>) {
    this.currentStockLoaded$ = this.store.select(
      appSelectors.selectCurrentStock
    );
    this.currentUser$ = this.store.select(
      appSelectors.selectCurrentUser
    );
    this.appError$ = this.store.select(
      appSelectors.selectAppError
    );
  }

  loadCurrentStock(ticker: string): void {
    this.store.dispatch(appActions.loadStockInfo({ stockTicker: ticker }));
  }

  createNewUser(user: User): void {
    this.store.dispatch(appActions.createNewUser({ user: user }));
  }
}
