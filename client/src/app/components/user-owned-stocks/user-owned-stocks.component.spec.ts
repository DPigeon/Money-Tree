import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from 'src/app/interfaces/stock';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
  NGX_ECHART,
} from '../../shared.module';
import {
  UserOwnedStocksComponent,
  OwnedStocksStats,
} from './user-owned-stocks.component';
import { StockDetailHeaderComponent } from '../stock-detail-header/stock-detail-header.component';
import { StockStatsComponent } from '../stock-stats/stock-stats.component';
import { StockAdditionalInfoComponent } from '../stock-additional-info/stock-additional-info.component';
import { HeaderComponent } from '../header/header.component';
import { StockSearchComponent } from '../stock-search/stock-search.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StockDetailComponent } from './../../pages/stock-detail/stock-detail.component';
import { HistoricalChartComponent } from '../historical-chart/historical-chart.component';
import { AlpacaUserPosition } from './../../interfaces/alpacaPosition';
import { Observable } from 'rxjs';

// integration tests
describe('UserOwnedStocksComponent', () => {
  let component: UserOwnedStocksComponent;
  let fixture: ComponentFixture<UserOwnedStocksComponent>;

  const stockInfo: Stock = {
    companyName: 'Apple inc',
    tickerSymbol: 'AAPL',
    stockValue: 125, // real-time average price
  };
  const ownedStocksStats: OwnedStocksStats = {
    noOfShares: '0',
    averagePerShare: '0',
    percentPortfolio: '0',
    thisStockTotal: 0,
    profitOrLossAmount: '0',
    profitOrLossPercent: '0',
  };

  const alpacaPositions: AlpacaUserPosition[] = [
    {
      symbol: 'AAPL',
      avgPrice: '120',
      qty: '5',
      cost: '600',
      currentPrice: '125',
      currentValue: '600',
      gainAmount: '25',
      change: '1',
      gainPercentage: '0.41',
    },
  ];
  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return 'AAPL';
        },
      },
    },
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
        NGX_ECHART,
      ],
      declarations: [
        StockDetailComponent,
        StockDetailHeaderComponent,
        StockStatsComponent,
        UserOwnedStocksComponent,
        StockAdditionalInfoComponent,
        HeaderComponent,
        StockSearchComponent,
        HistoricalChartComponent,
      ],
      providers: [
        StoreFacadeService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        NGRX_STORE_MODULE,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnedStocksComponent);
    component = fixture.componentInstance;
    component.stockInfo = stockInfo;
    component.alpacaPositions$ = new Observable<any>();
    component.alpacaPositions = alpacaPositions;
    fixture.detectChanges();
  });

  it('it should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should calculate stock stats correctly', () => {
    component.calculateOwnedStockInfo();
    expect(component.stockSymbol).toBe('AAPL');
    expect(component.stockCompanyName).toBe('Apple inc');
    expect(component.userStockNoOfShares).toBe(5);
    expect(component.userStockAvgShare).toBe('120.00');
    expect(component.userStockPortfolio).toBe('100.00');
    expect(component.profitOrLossAmount).toBe('25.00');
    expect(component.profitOrLossPercent).toBe('41.00');
    expect(component.userStockTotalValue).toBe('600.00');
  });

  it('it should show user stock info only if user has this stock ', () => {
    component.calculateOwnedStockInfo();
    expect(component.userHasThisStock()).toBe(true);
  });

  it('it should show the right color for +/- gain amounts ', () => {
    component.calculateOwnedStockInfo();
    expect(component.isUserGained()).toBe(true);
    expect(component.stockChangeColor()).toEqual('positive-change');

    component.ownedStocksStats.profitOrLossAmount = '-5.00';
    expect(component.isUserGained()).toBe(false);
    expect(component.stockChangeColor()).toEqual('negative-change');
  });
});
