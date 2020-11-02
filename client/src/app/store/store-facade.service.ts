import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/app.reducer';
import * as appActions from './actions/app.actions';
import * as appSelectors from './selectors/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class StoreFacadeService {
  currentStockLoaded$ = this.store.select(appSelectors.selectLoadedStock);

  constructor(private store: Store<State>) { }

  loadCurrentStock(ticker: string) {
    console.log("load current stock");
    this.store.dispatch(appActions.loadStockInfo({stockTicker: ticker}));
  }
}
