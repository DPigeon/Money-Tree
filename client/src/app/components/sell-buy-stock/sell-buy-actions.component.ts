import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Stock } from '../../interfaces/stock';
import { Transaction } from '../../interfaces/transaction';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-sell-buy-actions',
  templateUrl: './sell-buy-actions.component.html',
  styleUrls: ['./sell-buy-actions.component.scss'],
})
export class SellOrBuyActionsComponent {
  isMarketOrder = true;
  quantity = 0;
  price = 0;
  total = 0;
  currentStock: Stock;
  balance: number = 5000; // Faking this value for now, will have to get this from alpaca
  remainingBalance: number = 0
  
  constructor(
    public dialogRef: MatDialogRef<SellOrBuyActionsComponent>,
    private storeFacade: StoreFacadeService,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      stockInfo: Stock,
      userInfo: User
    }
  ) {
    this.currentStock = data.stockInfo;
    this.price = this.currentStock ? this.currentStock.stockValue : 0;
    this.remainingBalance = this.balance;
  }

  get stockPrice(): number {
    return this.data && this.data.stockInfo ? this.data.stockInfo.stockValue : 0;
  }

  get stockName(): string {
    return this.data && this.data.stockInfo ? this.data.stockInfo.companyName : '';
  }

  clearInputs(): void {
    this.quantity = 0;
    this.price = 0;
  }

  getProcessActionType(): string {
    return this.data.type === 'sell' ? 'Sell' : 'Buy';
  }

  processActions(): void {
    const transaction: Transaction = {
      symbol: this.data.stockInfo.tickerSymbol,
      qty: this.quantity,
      side: this.data.type,
      type: this.isMarketOrder ? "market" : "limit",
      time_in_force: "day"
    }
    this.storeFacade.processStockTransaction(transaction, this.data.userInfo.id);
    this.dialogRef.close();
  }
  
  getTotal(): number {
    return this.isMarketOrder && this.currentStock ? this.quantity * this.currentStock.stockValue : this.quantity * this.price;
  }

  getRemainingBalance(): number {
    this.remainingBalance = this.balance - this.total;
    return this.remainingBalance
  }

  getStockPrice(): number {
    return (this.data && this.data.stockInfo && this.data.stockInfo.stockValue) ? this.data.stockInfo.stockValue : 0;
  }
}
