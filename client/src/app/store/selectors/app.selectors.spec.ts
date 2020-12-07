import * as appSelectors from '../selectors/app.selectors';
import * as appReducers from '../reducers/app.reducer';
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

describe('Selectors', () => {
  it('should select the currently loaded stock', () => {
    const appState = appReducers.initialState;
    appState.currentStockLoaded = stockInfo;
    // we have our selector (selectCurrentStock)
    // we pass in the state we want to test it with (appState)
    // we look for the result (stockInfo)
    expect(appSelectors.selectCurrentStock.projector(appState)).toBe(stockInfo);
  });
});
