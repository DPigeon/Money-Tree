import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';

const mockTransactionBuy = {
  symbol: 'TSLA',
  qty: 5,
  total: 60,
  side: 'buy', // buy / sell
  type: 'MARKET_BUY', // market / limit
  time_in_force: '2021-03-10',
  status: 'PENDING', // This is the status of the order
  averagePricePerShare: 12,
  client_order_id: null,
};
const mockTransactionSell = {
  symbol: 'AAR',
  qty: 10,
  total: 600,
  side: 'sell', // buy / sell
  type: 'MARKET_SELL', // market / limit
  time_in_force: '2021-03-10',
  status: 'COMPLETED', // This is the status of the order
  averagePricePerShare: 60,
  client_order_id: null,
};
const mockTransactionHistory = [mockTransactionBuy, mockTransactionSell];

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [TransactionHistoryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('transactionHistoryComponent unit test', () => {
  let component: TransactionHistoryComponent;

  beforeEach(() => {
    component = new TransactionHistoryComponent();
    component.transactionHistory = mockTransactionHistory;
  });

  it('Should return the first half of the transaction', () => {
    component.ngOnInit();
    component.transactionHistory = mockTransactionHistory;
    expect(component.transactionFormatStart(component.transactionHistory[0])).toBe(
      'Bought ' + mockTransactionBuy.qty + ' shares of '
    );
    expect(component.transactionFormatStart(component.transactionHistory[1])).toBe(
      'Sold ' + mockTransactionSell.qty + ' shares of '
    );
    expect(component.transactionFormatStart(component.transactionHistory[2])).toBe(
      'err'
    );
  });

  it('Should return the end of the transaction', () => {
    component.ngOnInit();
    component.transactionHistory = mockTransactionHistory;
    expect(component.transactionFormatEnd(component.transactionHistory[0])).toBe(
      ' at an average of ' + mockTransactionBuy.averagePricePerShare + '$ per share.'
    );
    expect(component.transactionFormatEnd(component.transactionHistory[2])).toBe(
      'err'
    );
  });
});
