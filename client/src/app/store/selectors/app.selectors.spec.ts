import * as appSelectors from '../selectors/app.selectors';
import * as appReducers from '../reducers/app.reducer';
import { Stock } from '../../interfaces/stock';
import { StockHistory } from 'src/app/interfaces/stockHistory';
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
const users: UserSearch[] = [
  { id: 'u1', firstName: 'Money', lastName: 'Tree', email: 'money@tree.ca' },
];

describe('Selectors', () => {
  it('should select the currently loaded stock', () => {
    const appState = appReducers.initialState;
    appState.currentStockLoaded = stockInfo;
    // we have our selector (selectCurrentStock)
    // we pass in the state we want to test it with (appState)
    // we look for the result (stockInfo)
    expect(appSelectors.selectCurrentStock.projector(appState)).toBe(stockInfo);
  });

  it('should select the currently loaded stock history', () => {
    const appState = appReducers.initialState;
    appState.stockHistoricalDataLoaded = stockHistoricalData;
    expect(appSelectors.selectStockHistoricalData.projector(appState)).toBe(
      stockHistoricalData
    );
  });

  it('should select user list', () => {
    const appState = appReducers.initialState;
    appState.searchUserList = users;
    expect(appSelectors.selectUserSearchList.projector(appState)).toBe(users);
  });
});
