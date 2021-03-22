import * as fromActions from './app.actions';

describe('loadActionss', () => {
  it('should return an action', () => {
    expect(fromActions.loadStockInfo({ stockTicker: 'AC' }).type).toBe(
      '[Stock Info] Load Stock Info'
    );
  });
});

describe('loadHistoricalData', () => {
  it('should return an action', () => {
    expect(
      fromActions.loadStockHistoricalData({
        stockTicker: 'AC',
        chartRange: '1d',
        chartInterval: '5m',
      }).type
    ).toBe('[Stock History] Load Stock Historical Data');
  });

  it('should return an action (all users)', () => {
    expect(fromActions.loadUserSearchList().type).toBe(
      '[User Search List] Load all users'
    );
  });
});
