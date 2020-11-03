import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/app.reducer';
import * as appActions from './actions/app.actions';
import * as appSelectors from './selectors/app.selectors';
import { Observable } from 'rxjs';
import { Stock } from '../interfaces/stock';

@Injectable({
  providedIn: 'root'
})
export class StoreFacadeService {
  currentStockLoaded$: Observable<Stock>;
  
  constructor(private store: Store<{appState: State}>) { 
    this.currentStockLoaded$ = this.store.select(appSelectors.selectCurrentStock);
  }

  loadCurrentStock(ticker: string) {
    this.store.dispatch(appActions.loadStockInfo({stockTicker: ticker}));
  }
}
