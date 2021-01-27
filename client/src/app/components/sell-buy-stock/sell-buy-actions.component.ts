import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from '../../interfaces/stock'
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
  currentStock: Stock; // Ask alessandro if I need to keep this or if I can just do everything from the matdialog data
  balance: number = 5000; // Faking this value for now, will have to get this from alpaca
  remainingBalance: number = 0
  constructor(
    public dialogRef: MatDialogRef<SellOrBuyActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      stock: Stock
    }
  ) {
    this.currentStock = data.stock[0];
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
    this.data.type === 'sell' ? this.sellActions() : this.buyActions();
  }

  sellActions(): void {
    this.dialogRef.close();
  }
  buyActions(): void {
    this.dialogRef.close();
  }
  updateTotal(quantity: number, price: number): number {
    console.log("Actively updating total", this.total)
    this.total = quantity * price;
    return this.total
  }
  updateRemainingBalance(): number {
    console.log("Actively updating remaining balance", this.balance - this.total)
    this.remainingBalance = this.balance - this.total;
    return this.remainingBalance
  }

}
