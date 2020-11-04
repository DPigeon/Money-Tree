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
}

describe('Selectors', () => {
  it('should select the currently loaded stock', () => {
    let appState = appReducers.initialState;
    appState.currentStockLoaded = stockInfo
    expect(appSelectors.selectCurrentStock.projector(appState)).toBe(stockInfo)
  });
});
