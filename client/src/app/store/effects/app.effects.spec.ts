import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import * as appActions from '../actions/app.actions';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockService } from '../../services/stock/stock.service';
import { Effects } from './app.effects';

const stockInfo = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: -4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
  stats: {
    open: 100.50,
    high: 200.20,
    low: 516510,
    volume: 151515,
    mktCap: 51651,
    wh: 455,
    wl: 123,
    avgVolume: 199410,
  },
};

describe('Effects', () => {
  let actions$: Observable<any> = new Observable();
  let effects: Effects;
  const mockStockService = {
    loadStockInfo: jest.fn(() => of(stockInfo)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Effects,
        provideMockActions(() => actions$),
        { provide: StockService, useValue: mockStockService },
      ],
    });

    effects = TestBed.inject(Effects);
  });

  // integration test
  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  // unit test
  it('should load the data for the stock', (done) => {
    // done says that this test is asyncronous
    actions$ = of(appActions.loadStockInfo({ stockTicker: 'AC' })); // call the action of the effect we want to test

    effects.getStock$.subscribe((res) => {
      // subscribe to the observable / variable we want to test
      const key = 'stock';
      expect(res[key]).toEqual(stockInfo); // we do our assertions
      done(); // we say that the asyncronous test is finished
    });
  });
});
