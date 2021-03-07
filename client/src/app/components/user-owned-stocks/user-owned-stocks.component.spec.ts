import { StockDetailComponent } from './../../pages/stock-detail/stock-detail.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from 'src/app/interfaces/stock';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { UserOwnedStocksComponent } from './user-owned-stocks.component';
import { StockDetailHeaderComponent } from '../stock-detail-header/stock-detail-header.component';
import { StockStatsComponent } from '../stock-stats/stock-stats.component';
import { StockAdditionalInfoComponent } from '../stock-additional-info/stock-additional-info.component';
import { HeaderComponent } from '../header/header.component';
import { StockSearchComponent } from '../stock-search/stock-search.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// integration tests
describe('UserOwnedStocksComponent', () => {
  let component: UserOwnedStocksComponent;
  let fixture: ComponentFixture<UserOwnedStocksComponent>;

  const stockInfo: Stock = {
    companyName: 'Apple inc',
    tickerSymbol: 'AAPL',
    stockValue: 110, // real-time average price
  };
  const userOwnedStocks: Stock[] = [
    {
      companyName: 'Apple inc',
      tickerSymbol: 'AAPL',
      quantity: '10',
      avgPrice: '100',
    },
    {
      companyName: 'Apple inc',
      tickerSymbol: 'AAPL',
      quantity: '20',
      avgPrice: '80',
    },
    {
      companyName: 'Apple inc',
      tickerSymbol: 'AAPL',
      quantity: '7',
      avgPrice: '30',
    },
    {
      companyName: 'Tesla',
      tickerSymbol: 'TSLA',
      quantity: '5',
      avgPrice: '1000',
    },
    /*
    / with the above stocks we will have 37 shares of apple and 5 shares of tesla
    / total spent on all of the stocks would be : $7810
    / total spent on Apple would be $2810 with the average price of: 2810/37 = 75.95
    / percent portfolio for apple stocks would be 2810/7810 * 100 = 35.98
    / profit/loss amount would be: (75.95 * 37)-(110*37) = -1260.00 (loss), absolute value
    / profit/loss percent would be: [(75.94-110)/110] * 100 = -30.96 %, absolute value
    */
  ];

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return 'AC';
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
      ],
      declarations: [
        StockDetailComponent,
        StockDetailHeaderComponent,
        StockStatsComponent,
        UserOwnedStocksComponent,
        StockAdditionalInfoComponent,
        HeaderComponent,
        StockSearchComponent,
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
    component.userOwnedStocks = userOwnedStocks;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate stock stats correctly', () => {
    component.calculateOwnedStockInfo();
    expect(component.stockSymbol).toBe('AAPL');
    expect(component.stockCompanyName).toBe('Apple inc');
    expect(component.userStockNoOfShares).toBe(37);
    expect(component.userStockAvgShare).toBe('75.95');
    expect(component.userStockPortfolio).toBe('35.98');
    expect(component.profitOrLossAmount).toBe('1260.00'); // absolute value
    expect(component.profitOrLossPercent).toBe('30.96'); // absolute value
    expect(component.userStockTotalValue).toBe('2810.00');
  });

  it('should return "" if stockInfo has not beeen yet loaded', () => {
    component.stockInfo = null;
    expect(component.stockSymbol).toBe('');
    expect(component.stockCompanyName).toBe('');
  });

  it('should return 0 if userOwnedStockStats has not beeen yet calculated', () => {
    component.userOwnedStocks = null;
    component.calculateOwnedStockInfo();
    expect(component.userStockNoOfShares).toBe(0);
    expect(component.userStockAvgShare).toBe('0');
    expect(component.userStockPortfolio).toBe('0');
    expect(component.profitOrLossAmount).toBe('0'); // absolute value
    expect(component.profitOrLossPercent).toBe('0'); // absolute value
    expect(component.userStockTotalValue).toBe('0');
  });

  it('should see if the user is in profit or loss', () => {
    component.calculateOwnedStockInfo();
    expect(component.isUserGained()).toBe(false);
    expect(component.stockChangeColor()).toBe('negative-change');
    // reducing the value of stock so that user goes into profit
    component.stockInfo.stockValue = 50;
    component.calculateOwnedStockInfo();
    expect(component.isUserGained()).toBe(true);
    expect(component.stockChangeColor()).toBe('positive-change');
  });

  it('should not show the stats if user does not have the stock', () => {
    component.calculateOwnedStockInfo();
    expect(component.ownedStocksStats.noOfShares).toBe(37);
    expect(component.userHasThisStock()).toBe(true);
    // changing to a stock that user does not have:
    component.stockInfo.tickerSymbol = 'SOMEOTHERSTOCK';
    component.calculateOwnedStockInfo();
    expect(component.ownedStocksStats.noOfShares).toBe(0);
    expect(component.userHasThisStock()).toBe(false);
  });
});
