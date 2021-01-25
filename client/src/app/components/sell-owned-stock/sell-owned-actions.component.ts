import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sell-owned-actions',
  templateUrl: './sell-owned-actions.component.html',
  styleUrls: ['./sell-owned-actions.component.scss'],
})
export class SellOwnedActionsComponent implements OnInit {
  isMarketOrder = true;
  quantity = 0;
  price = 0;
  constructor(
    public dialogRef: MatDialogRef<SellOwnedActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  clearInputs(): void {
    this.quantity = 0;
    this.price = 0;
  }
  sellActions(): void {
    this.dialogRef.close();
  }
}
