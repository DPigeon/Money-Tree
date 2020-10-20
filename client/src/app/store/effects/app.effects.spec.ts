import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { Effects } from './app.effects';

describe('Effects', () => {
  const actions$: Observable<any> = new Observable();
  let effects: Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Effects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(Effects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
