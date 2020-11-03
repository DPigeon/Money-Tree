import { TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { StoreFacadeService } from './store-facade.service';
import * as appActions from './actions/app.actions';
import { NGRX_STORE_MODULE } from '../shared.module';

describe('StoreFacadeService', () => {
  let service: StoreFacadeService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NGRX_STORE_MODULE]
    });

    store = TestBed.inject(MockStore);
    service = TestBed.inject(StoreFacadeService);
  });

  it('should dispatch load stock action', () =>{
    const spy = jest.spyOn(store, 'dispatch');
    service.loadCurrentStock('AC');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      appActions.loadStockInfo({stockTicker: 'AC'})
    )
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
