// tslint:disable
import { TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { StockDetailComponent } from './stock-detail.component';
import { StoreFacadeService } from '../../store/store-facade.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
class MockStoreFacadeService {
  stockHistoricalDataLoaded$ = {};
  currentStockLoaded$ = {};
  currentMarketClock$ = {};
  currentUser$ = {};
  userOwnedStocks$ = {};
}

@Injectable()
class MockRouter {
  navigate() {}
}

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('StockDetailComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        StockDetailComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        OneviewPermittedDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: StoreFacadeService, useClass: MockStoreFacadeService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({}),
          },
        },
        { provide: Router, useClass: MockRouter },
      ],
    })
      .overrideComponent(StockDetailComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(StockDetailComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.stockHistoricalData$ = component.stockHistoricalData$ || {};
    component.stockHistoricalData$.subscribe = jest
      .fn()
      .mockReturnValue([null]);
    component.route = component.route || {};
    component.route.snapshot = {
      paramMap: {
        get: function () {},
      },
    };
    component.storeFacade = component.storeFacade || {};
    component.storeFacade.loadCurrentStock = jest.fn();
    component.storeFacade.loadCurrentStockHistoricalData = jest.fn();
    component.storeFacade.loadMarketClock = jest.fn();
    component.storeFacade.loadUserOwnedStocks = jest.fn();
    component.storeFacade.loadTopInvestorsOnAStock = jest.fn();
    component.storeFacade.loadFollowersWithSameStock = jest.fn();
    component.storeFacade.loadStocksOwnedByUsersOwnThisStock = jest.fn();
    component.router = component.router || {};
    component.router.events = observableOf({});
    component.ngOnInit();
  });

  it('should run #changeChartRangeInterval()', async () => {
    component.storeFacade = component.storeFacade || {};
    component.storeFacade.loadCurrentStockHistoricalData = jest.fn();
    component.changeChartRangeInterval({
      range: {},
      interval: {},
    });
  });
});
