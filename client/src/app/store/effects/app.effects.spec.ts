import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import * as appActions from '../actions/app.actions';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockService } from '../../services/stock/stock.service';
import { Effects } from './app.effects';
import { UserService } from 'src/app/services/user/user.service';

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
    stock52weekHigh: 455,
    stock52weekLow: 123,
    avgVolume: 199410,
  },
};

const userInfo = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'john1',
  avatarUrl: '',
  email: 'john1@gmail.com',
  score: 12,
  rank: 10000,
  balance: 223,
  alpacaApiKey: null,
  follows: [],
  followers: [],
  portfolio: [],
  transactions: [],
};

// Missing error handling cases
describe('Effects', () => {
  let actions$: Observable<any> = new Observable();
  let effects: Effects;
  const mockStockService = {
    loadStockInfo: jest.fn(() => of(stockInfo)),
  } as any;

  const mockUserService = {
    createNewUser: jest.fn(() => of(userInfo)),
    updateAlpacaCode: jest.fn(() => of(userInfo)),
    getUser: jest.fn(() => of(userInfo)),
    userLogin: jest.fn(() => of(userInfo)),
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Effects,
        provideMockActions(() => actions$),
        { provide: StockService, useValue: mockStockService },
        { provide: UserService, useValue: mockUserService },
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

  it('should return user when creating a new user', (done) => {
    actions$ = of(appActions.createNewUser({ user: userInfo }));
    effects.createNewUser$.subscribe((res) => {
      const key = 'user';
      expect(res[key]).toEqual(userInfo);
      done();
    });
  });

  // this test will change
  it('should return user when updating user', (done) => {
    actions$ = of(appActions.upadateUser({ user: userInfo }));
    effects.updateUser$.subscribe((res) => {
      const key = 'user';
      expect(res[key]).toEqual(userInfo);
      done();
    });
  });

  it('should get current user if user get is requested', (done) => {
    actions$ = of(appActions.getCurrentUser({ id: userInfo.id }));
    effects.getCurrentUser$.subscribe((res) => {
      const key = 'user';
      expect(res[key]).toEqual(userInfo);
      done();
    });
  });

  it('should get current user if user logsin', (done) => {
    actions$ = of(appActions.userLogin({ user: userInfo }));
    effects.userLogin$.subscribe((res) => {
      const key = 'user';
      expect(res[key]).toEqual(userInfo);
      done();
    });
  });
});
