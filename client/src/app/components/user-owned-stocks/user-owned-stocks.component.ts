import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { SellOrBuyActionsComponent } from '../sell-buy-stock/sell-buy-actions.component';

@Component({
  selector: 'app-user-stocks',
  templateUrl: './user-owned-stocks.component.html',
  styleUrls: ['./user-owned-stocks.component.scss'],
})

export class UserOwnedStocksComponent {
  @Input() stockInfo: Stock;
  @Input() userInfo: User;
  constructor(public dialog: MatDialog) {}

  get stockSymbol(): string {
    return 'AAPL'; // to be changed
  }

  get userStockNoOfShares(): number {
    return 14;
  }

  get userStockAvgShare(): number {
    return 16.2;
  }

  get userStockPortfolio(): string {
    return '%23';
  }

  get userStockTotalValue(): string {
    return '$ 250.24';
  }

  get userStockChange(): string {
    return '$ 24.22';
  }

  get userStockPercentageChange(): string {
    return '%8.08';
  }

  isUserStockIncrease(): boolean {
    return true;
  }
  stockChangeColor(): string {
    return true ? 'negative-change' : 'positive-change';
  }

  openSellOrBuyActionsModal(type: string, stock: Stock): void {
    console.log("Type: ", type, "Stock:", stock)
    const dialogRef = this.dialog.open(SellOrBuyActionsComponent, {
      // data to be passed into modal
      data: {
        type, stock
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // returned results
    });
  }
}
