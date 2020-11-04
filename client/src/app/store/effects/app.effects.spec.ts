import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import * as appActions from '../actions/app.actions';

import { Effects } from './app.effects';

const stockInfo = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: -4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
}

describe('Effects', () => {
  let actions$: Observable<any> = new Observable();
  let effects: Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Effects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(Effects);
  });

  // integration test
  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  // unit test
  it('should load the data for the stock', (done) =>{ // done says that this test is asyncronous 
    actions$ = of(appActions.loadStockInfo({stockTicker: 'AC'})); // call the action of the effect we want to test
    effects.getStock$.subscribe((res) => { // subscribe to the observable / variable we want to test
      expect(res['stock']).toEqual(stockInfo); // we do our assertions
      done(); // we say that the asyncronous test is finished
    })
  })
});
