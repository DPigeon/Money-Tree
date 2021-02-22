import { TestBed } from '@angular/core/testing';

import { WebsocketAPIService } from './websocket-api.service';

describe('WebsocketAPIService', () => {
  let service: WebsocketAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
