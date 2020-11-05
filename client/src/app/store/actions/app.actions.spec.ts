import * as fromActions from './app.actions';

describe('loadActionss', () => {
  it('should return an action', () => {
    expect(fromActions.loadStockInfo({stockTicker: 'AC'}).type).toBe('[Stock Info] Load Stock Info');
  });
});
