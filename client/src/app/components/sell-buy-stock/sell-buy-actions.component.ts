import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Stock } from '../../interfaces/stock';
import { Transaction } from '../../interfaces/transaction';

@Component({
  selector: 'app-sell-buy-actions',
  templateUrl: './sell-buy-actions.component.html',
  styleUrls: ['./sell-buy-actions.component.scss'],
})
export class SellOrBuyActionsComponent implements OnInit {
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
      stock: Stock
    }
  ) {
    this.currentStock = data.stock;
    this.price = this.currentStock.stockValue;
    this.remainingBalance = this.balance;
  }
  ngOnInit(): void { }
  clearInputs(): void {
    this.quantity = 0;
    this.price = 0;
  }

  getProcessActionType(): string {
    return this.data.type === 'sell' ? 'Sell' : 'Buy';
  }

  processActions(): void {
    const transaction: Transaction = {
      symbol: this.data.stock.tickerSymbol,
      qty: this.quantity,
      side: this.data.type,
      type: this.isMarketOrder ? "market" : "limit",
      time_in_force: "day"
    }
    this.storeFacade.processStockTransaction(transaction);
    this.dialogRef.close();
  }
  
  getTotal(): number {
    return this.isMarketOrder ? this.quantity * this.currentStock.stockValue : this.quantity * this.price;
  }

  getRemainingBalance(): number {
    this.remainingBalance = this.balance - this.total;
    return this.remainingBalance
  }

  getStockPrice(): number {
    return (this.data != null && this.data.stock.stockValue != null) ? this.data.stock.stockValue : 0;
  }
}
