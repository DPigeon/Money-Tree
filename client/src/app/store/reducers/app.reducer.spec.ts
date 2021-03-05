import { reducer, initialState } from './app.reducer';
import * as appActions from '../actions/app.actions';
import { Stock } from '../../interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { UserSearch } from 'src/app/interfaces/userSearch';

const stockInfo: Stock = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: -4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
  logo: '',
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
const stockHistoricalData = {
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
const users: UserSearch[] = [
  { id: 20, firstName: 'Money', lastName: 'Tree', email: 'money@tree.ca' },
];

const userInfo: User = {
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
};

describe('Reducer Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });

    it('should return the state with loaded stock', () => {
      const action = appActions.stockInfoLoadSuccess({ stock: stockInfo });
      const state = reducer(initialState, action);
      expect(state.currentStockLoaded).toEqual(stockInfo);
    });

    it('should return the state with loaded stock history', () => {
      const action = appActions.stockHistoricalDataLoadSuccess({
        stockHistoricalData,
      });
      const state = reducer(initialState, action);
      expect(state.stockHistoricalDataLoaded).toEqual(stockHistoricalData);
    });

    it('should return the state with set user', () => {
      const action = appActions.setCurrentUser({ user: userInfo });
      const state = reducer(initialState, action);
      expect(state.user).toEqual(userInfo);
    });

    it('should return the state with error message', () => {
      const action = appActions.setAppError({
        errorMessage: {
          status: '',
          message: 'error',
          debugMessage: '',
          timestamp: '',
        },
      });
      const state = reducer(initialState, action);
      expect(state.errorMessage.message).toEqual('error');
    });

    it('should return the state with user list', () => {
      const action = appActions.loadUserSearchListSuccess({
        userSearchList: users,
      });
      const state = reducer(initialState, action);
      expect(state.searchUserList).toEqual(users);
    });

    it('should return a null user state when logged out', () => {
      const action1 = appActions.setCurrentUser({ user: userInfo });
      const state1 = reducer(initialState, action1);
      expect(state1.user).toEqual(userInfo);
      const action2 = appActions.logCurrentUserOut();
      const state2 = reducer(state1, action2);
      expect(state2.user).toEqual(null);
    });
  });
});
