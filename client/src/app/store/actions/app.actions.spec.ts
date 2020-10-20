import * as fromActions from './app.actions';

describe('loadActionss', () => {
  it('should return an action', () => {
    expect(fromActions.loadActionss().type).toBe('[Actions] Load Actionss');
  });
});
