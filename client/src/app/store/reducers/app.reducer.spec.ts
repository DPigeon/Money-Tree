import { reducer, initialState } from './app.reducer';
import * as appActions from '../actions/app.actions';
import { Stock } from '../../interfaces/stock';

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
  });
});
