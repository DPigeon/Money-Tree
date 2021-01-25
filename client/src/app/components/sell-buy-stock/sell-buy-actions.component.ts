import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sell-buy-actions',
  templateUrl: './sell-buy-actions.component.html',
  styleUrls: ['./sell-buy-actions.component.scss'],
})
export class SellOrBuyActionsComponent implements OnInit {
  isMarketOrder = true;
  quantity = 0;
  price = 0;
  constructor(
    public dialogRef: MatDialogRef<SellOrBuyActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
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
}
