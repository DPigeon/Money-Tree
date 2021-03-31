import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';
import { Transaction } from 'src/app/interfaces/transaction';

const mockTransactionBuy: Transaction = {
  symbol: 'TSLA',
  qty: 5,
  total: 60,
  side: 'buy', // buy / sell
  type: 'MARKET_BUY', // market / limit
  timeInForce: '2021-03-10',
  status: 'PENDING', // This is the status of the order
  averagePricePerShare: 12,
  client_order_id: null,
};
const mockTransactionSell: Transaction = {
  symbol: 'AAR',
  qty: 10,
  total: 600,
  side: 'sell', // buy / sell
  type: 'MARKET_SELL', // market / limit
  timeInForce: '2021-03-10',
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
    component.transactions = mockTransactionHistory;
  });

  it('Should return the first half of the transaction', () => {
    component.ngOnChanges();
    component.transactions = mockTransactionHistory;
    expect(component.transactionFormatStart(component.transactions[0])).toBe(
      'Bought ' + mockTransactionBuy.qty + ' shares of '
    );
    expect(component.transactionFormatStart(component.transactions[1])).toBe(
      'Sold ' + mockTransactionSell.qty + ' shares of '
    );
    expect(component.transactionFormatStart(component.transactions[2])).toBe(
      'err'
    );
  });

  it('Should return the end of the transaction', () => {
    component.ngOnChanges();
    component.transactions = mockTransactionHistory;
    expect(component.transactionFormatEnd(component.transactions[0])).toBe(
      ' at an average of ' + mockTransactionBuy.averagePricePerShare + '$ per share.'
    );
    expect(component.transactionFormatEnd(component.transactions[2])).toBe(
      'err'
    );
  });
});
