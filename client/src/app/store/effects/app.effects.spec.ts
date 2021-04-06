import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import * as appActions from '../actions/app.actions';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockService } from '../../services/stock/stock.service';
import { Effects } from './app.effects';
import { UserService } from 'src/app/services/user/user.service';
import { MATERIAL_MODULE_DEPENDENCIES } from 'src/app/shared.module';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import { UserSearch } from 'src/app/interfaces/userSearch';

const stockInfo = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: -4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
  stats: {
    open: 100.5,
    high: 200.2,
    low: 516510,
    volume: 151515,
    mktCap: 51651,
    stock52weekHigh: 455,
    stock52weekLow: 123,
    avgVolume: 199410,
  },
};
const stockHistoricalData: StockHistory = {
  symbol: 'TSLA',
  closePrice: [
    689.8787841796875,
    687.1099853515625,
    688.989990234375,
    696.7550048828125,
    696.219970703125,
    691.0900268554688,
    688.1400146484375,
    688.77001953125,
    680.3201293945312,
    678.8049926757812,
    679.0734252929688,
    678.8300170898438,
    680.3511962890625,
    683.6300048828125,
    677.9600219726562,
    683.1719970703125,
    684,
  ],
  timestamp: [
    1614781800,
    1614782100,
    1614782400,
    1614782700,
    1614783000,
    1614783300,
    1614783600,
    1614783900,
    1614784200,
    1614784500,
    1614784800,
    1614785100,
    1614785400,
    1614785700,
    1614786000,
    1614786276,
  ],
  currency: 'USD',
};

const userInfo = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'john1',
  avatarURL: '',
  coverPhotoURL: '',
  email: 'john1@gmail.com',
  score: 12,
  rank: 10000,
  balance: 223,
  alpacaApiKey: null,
  portfolio: [],
  transactions: [],
};

const users: UserSearch[] = [
  { id: 'u1', firstName: 'Money', lastName: 'Tree', email: 'money@tree.ca' },
];

// Missing error handling cases
describe('Effects', () => {
  let actions$: Observable<any> = new Observable();
  let effects: Effects;
  const mockStockService = {
    loadStockInfo: jest.fn(() => of(stockInfo)),
    loadStockHistoricalData: jest.fn(() => of(stockHistoricalData)),
  } as any;

  const mockUserService = {
    createNewUser: jest.fn(() => of(userInfo)),
    updateUser: jest.fn(() => of(userInfo)),
    getUser: jest.fn(() => of(userInfo)),
    getAllUsers: jest.fn(() => of(users)),
    userLogin: jest.fn(() => of(userInfo)),
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MATERIAL_MODULE_DEPENDENCIES],
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

  it('should load the historical data for the stock', (done) => {
    actions$ = of(
      appActions.loadStockHistoricalData({
        stockTicker: 'TSLA',
        chartRange: '1d',
        chartInterval: '5m',
      })
    );
    effects.getStockHistoricalData$.subscribe((res) => {
      const key = 'stockHistoricalData';
      expect(res[key]).toEqual(stockHistoricalData);
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

  it('should return null error message if backend error is not defined', (done) => {
    const backendError = undefined;
    expect(effects.mirrorError(backendError)).toEqual(null);
    done();
  });

  it('should load user list', (done) => {
    actions$ = of(appActions.loadUserSearchList());
    effects.loadUserSearchList$.subscribe((res) => {
      const key = 'userSearchList';
      expect(res[key]).toEqual(users);
      done();
    });
  });
});
