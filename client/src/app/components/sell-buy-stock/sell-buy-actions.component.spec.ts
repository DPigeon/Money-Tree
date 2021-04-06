import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { SellOrBuyActionsComponent } from './sell-buy-actions.component';

const mockUser: User = {
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
};

const mockStock = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: -4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
  stats: {
    open: 100.5,
    high: 200.2,
    low: 516510,
    volume: 151515,
    mktCap: 51651,
    stock52weekHigh: 455,
    stock52weekLow: 123,
    avgVolume: 199410,
  },
} as any;

const matDialogMock = {
  close: jest.fn(),
} as any;

const mockStoreFacade = {
  processStockTransaction: jest.fn(),
} as any;

const mockDialogData = {
  type: 'sell',
  stockInfo: mockStock,
  userInfo: mockUser,
};

describe('SellOrBuyActionsComponent', () => {
  let component: SellOrBuyActionsComponent;
  let fixture: ComponentFixture<SellOrBuyActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        NGRX_STORE_MODULE,
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      declarations: [SellOrBuyActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellOrBuyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SellOrBuyActionsComponent unit test', () => {
  let component: SellOrBuyActionsComponent;

  beforeEach(() => {
    component = new SellOrBuyActionsComponent(
      matDialogMock,
      mockStoreFacade,
      mockDialogData
    );
  });

  it('should return the right stockprice', () => {
    component.data = null;
    component.ngOnInit();
    expect(component.stockPrice).toBe(0);
    component.data = mockDialogData;
    expect(component.stockPrice).toBe(mockDialogData.stockInfo.stockValue);
  });

  it('should return the right stock name', () => {
    component.data = null;
    component.ngOnInit();
    expect(component.stockName).toBe('');
    component.data = mockDialogData;
    expect(component.stockName).toBe(component.data.stockInfo.companyName);
  });

  it('should return the total', () => {
    component.ngOnInit();
    expect(component.getTotal()).toBe(0);
    component.data.stockInfo = mockDialogData.stockInfo;
    component.quantity = 2;
    component.price = 10;
    component.isMarketOrder = true;
    expect(component.getTotal()).toBe(
      mockDialogData.stockInfo.stockValue * component.quantity
    );
    component.isMarketOrder = false;
    expect(component.getTotal()).toBe(component.price * component.quantity);
  });

  it('should return the remaining balance', () => {
    component.ngOnInit();
    expect(component.getRemainingBalance()).toBe(component.balance);
    component.data = mockDialogData;
    component.quantity = 2;
    component.isMarketOrder = true;
    expect(component.getRemainingBalance()).toBe(
      component.balance + component.getTotal()
    );
  });

  it('should return Buy or Sell', () => {
    component.ngOnInit();
    component.data = mockDialogData;
    expect(component.getProcessActionType()).toBe('Sell');
  });

  it('should return true or false if transaction is valid or not', () => {
    component.ngOnInit();
    component.data = mockDialogData;
    component.price = -2;
    component.quantity = 1;
    expect(component.buySellVerify()).toBe(true);
    component.isMarketOrder = true;
    component.price = 2;
    component.quantity = 1;
    expect(component.buySellVerify()).toBe(false);
  });
});
