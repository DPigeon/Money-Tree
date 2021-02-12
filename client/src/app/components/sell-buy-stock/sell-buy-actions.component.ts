import { Component, Inject, OnInit } from '@angular/core';
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
export class SellOrBuyActionsComponent implements OnInit {
  isMarketOrder = true;
  quantity = 0;
  price = 0;
  currentStock: Stock;
  balance: number = 0;
  remainingBalance: number = 0
  
  constructor(
    public dialogRef: MatDialogRef<SellOrBuyActionsComponent>,
    private storeFacade: StoreFacadeService,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      stockInfo: Stock,
      userInfo: User
    }
  ) {}

  ngOnInit() {
    this.currentStock = this.data ? this.data.stockInfo : null;
    this.price = this.currentStock ? this.currentStock.stockValue : 0;
    this.balance = this.data && this.data.userInfo && this.data.userInfo.balance ? this.data.userInfo.balance : 100000; // BUG: Initial balance not gotten because balance updates after each transaction
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
    return this.data.type.charAt(0).toUpperCase() + this.data.type.slice(1);
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
    return this.balance - this.getTotal();
  }

}
