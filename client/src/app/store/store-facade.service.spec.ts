import { TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { StoreFacadeService } from './store-facade.service';
import * as appActions from './actions/app.actions';
import { NGRX_STORE_MODULE } from '../shared.module';

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
  follows: [],
  followers: [],
  portfolio: [],
  transactions: [],
};

describe('StoreFacadeService', () => {
  let service: StoreFacadeService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NGRX_STORE_MODULE],
    });

    store = TestBed.inject(MockStore);
    service = TestBed.inject(StoreFacadeService);
  });

  // integration test
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // unit test
  it('should dispatch load stock action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.loadCurrentStock('TESLA');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      appActions.loadStockInfo({ stockTicker: 'TESLA' })
    );
  });

  it('should dispatch load stock historical data action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.loadCurrentStockHistoricalData('TSLA', '1d', '5m');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      appActions.loadStockHistoricalData({
        stockTicker: 'TSLA',
        chartRange: '1d',
        chartInterval: '5m',
      })
    );
  });

  it('should dispatach create new user', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.createNewUser(userInfo);
    expect(spy).toHaveBeenCalledWith(
      appActions.createNewUser({ user: userInfo })
    );
  });

  it('should dispatach user login', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.userLogin(userInfo);
    expect(spy).toHaveBeenCalledWith(appActions.userLogin({ user: userInfo }));
  });

  it('should dispatach update user', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.updateUser(userInfo);
    expect(spy).toHaveBeenCalledWith(
      appActions.upadateUser({ user: userInfo })
    );
  });

  it('should dispatach get current user', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.getCurrentUser(userInfo.id);
    expect(spy).toHaveBeenCalledWith(
      appActions.getCurrentUser({ id: userInfo.id })
    );
  });

  it('should dispatach log user out', () => {
    const spy = jest.spyOn(store, 'dispatch');
    service.logCurrentUserOut();
    expect(spy).toHaveBeenCalledWith(appActions.logCurrentUserOut());
  });
});
