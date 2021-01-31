import { reducer, initialState } from './app.reducer';
import * as appActions from '../actions/app.actions';
import { Stock } from '../../interfaces/stock';
import { User } from 'src/app/interfaces/user';

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
  follows: [],
  followers: [],
  portfolio: [],
  transactions: [],
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
