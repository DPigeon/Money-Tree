import { TestBed } from '@angular/core/testing';

import { StoreFacadeService } from './store-facade.service';

describe('StoreFacadeService', () => {
  let service: StoreFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
