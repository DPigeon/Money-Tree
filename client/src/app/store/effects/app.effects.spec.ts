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

  it('should load the data for the stock', (done) =>{
    actions$ = of(appActions.loadStockInfo({stockTicker: 'AC'}));
    effects.getStock$.subscribe((res) => {
      expect(res['stock']).toEqual(stockInfo);
      done();
    })
  })

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
