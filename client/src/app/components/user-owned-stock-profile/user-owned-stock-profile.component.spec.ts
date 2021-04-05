import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOwnedStockProfileComponent } from './user-owned-stock-profile.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
  USER_SERVICE,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Stock } from 'src/app/interfaces/stock';

const fakeStockList: Stock[] = [
  {
    tickerSymbol: 'AAPL',
    companyName: 'Apple inc.',
    stockChange: 0.5,
    stockChangePercent: 2,
    quantity: '10',
    avgPrice: '3.00',
    total: '30.00',
  },
  {
    tickerSymbol: 'TSLA',
    companyName: 'Tesla',
    stockChange: -0.8,
    stockChangePercent: -2,
    quantity: '20',
    avgPrice: '6.00',
    total: '120.00',
  },
  {
    tickerSymbol: 'ANOTHER',
    companyName: 'ANOTHER',
  },
];

const fakePositions: AlpacaUserPosition[] = [
  { symbol: 'AAPL', avgPrice: '5', qty: '3.00', currentPrice: '5', gainAmount: '10' },
  { symbol: 'TSLA', avgPrice: '8', qty: '20', currentPrice: '2.00', gainAmount: '-20' },
];

// integration tests
describe('UserOwnedStockProfileComponent', () => {
  let component: UserOwnedStockProfileComponent;
  let fixture: ComponentFixture<UserOwnedStockProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
        HttpClientTestingModule,
      ],
      declarations: [UserOwnedStockProfileComponent],
      providers: [
        NGRX_STORE_MODULE,
        USER_SERVICE,
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnedStockProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const mockRouter = {
  navigate: jest.fn(),
} as any;
const mockUserService = {
  getUserAlpacaPosition: jest.fn(),
} as any;

// unit tests
describe('UserOwnedStockProfileComponent Unit Test', () => {
  let component: UserOwnedStockProfileComponent;
  beforeEach(() => {
    component = new UserOwnedStockProfileComponent(mockRouter);
  });

  it('should properly compare stocks and positions and generate table', () => {
    component.userOwnedStocks = fakeStockList;
    component.alpacaPositions = fakePositions;
    component.tableDataGenerator();
    expect(component.dataSource.data[0].company).toEqual('AAPL');
    expect(component.dataSource.data[1].company).toEqual('TSLA');
    expect(component.dataSource.data[2]).toEqual(undefined);
  });

  it('should choose the right color for +/- stock', () => {
    component.userOwnedStocks = fakeStockList;
    component.alpacaPositions = fakePositions;
    component.tableDataGenerator();
    expect(
      component.stockChangeColor(Number(component.dataSource.data[0].gain_loss))
    ).toEqual('positive-change');
    expect(
      component.stockChangeColor(Number(component.dataSource.data[1].gain_loss))
    ).toEqual('negative-change');
  });
});
