import { TestBed } from '@angular/core/testing';
import { MATERIAL_MODULE_DEPENDENCIES, NGRX_STORE_MODULE } from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';

import { WebsocketAPIService } from './websocket-api.service';

describe('WebsocketAPIService', () => {
  let service: WebsocketAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, RouterTestingModule],
      providers: NGRX_STORE_MODULE,
    });
    service = TestBed.inject(WebsocketAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
