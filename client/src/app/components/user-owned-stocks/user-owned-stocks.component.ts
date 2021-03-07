import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { SellOrBuyActionsComponent } from '../sell-buy-stock/sell-buy-actions.component';

export interface OwnedStocksStats {
  noOfShares?: number;
  totalOwned?: number; // total value of all the stocks this user owns (to calculate portfolio %)
  thisStockTotal?: number; // total value if this stock owned by the user
  averagePerShare?: number;
  percentPortfolio?: number;
  profitOrLossAmount?: number;
  profitOrLossPercent?: number;
}
@Component({
  selector: 'app-user-stocks',
  templateUrl: './user-owned-stocks.component.html',
  styleUrls: ['./user-owned-stocks.component.scss'],
})
export class UserOwnedStocksComponent implements OnChanges {
  @Input() stockInfo: Stock;
  @Input() userOwnedStocks: Stock[];
  @Input() userInfo: User;

  ownedStocksStats: OwnedStocksStats;

  constructor(public dialog: MatDialog) {}
  ngOnChanges(): void {
    if (this.userOwnedStocks) {
      this.calculateOwnedStockInfo();
    }
  }

  get stockSymbol(): string {
    return this.stockInfo ? this.stockInfo.tickerSymbol : '';
  }

  get stockCompanyName(): string {
    return this.stockInfo ? this.stockInfo.companyName : '';
  }

  get userStockNoOfShares(): number {
    return this.ownedStocksStats ? this.ownedStocksStats.noOfShares : 0;
  }

  get userStockAvgShare(): string {
    return this.ownedStocksStats
      ? this.ownedStocksStats.averagePerShare.toFixed(2)
      : '0';
  }

  get userStockPortfolio(): string {
    return this.ownedStocksStats
      ? this.ownedStocksStats.percentPortfolio.toFixed(2)
      : '0';
  }

  get userStockTotalValue(): string {
    return this.ownedStocksStats
      ? this.ownedStocksStats.thisStockTotal.toFixed(2)
      : '0';
  }

  get profitOrLossAmount(): string {
    if (this.ownedStocksStats) {
      return Math.abs(this.ownedStocksStats.profitOrLossAmount).toFixed(2);
    }
    return '0';
  }

  get profitOrLossPercent(): string {
    if (this.ownedStocksStats) {
      return Math.abs(this.ownedStocksStats.profitOrLossPercent).toFixed(2);
    }
    return '0';
  }

  isUserGained(): boolean {
    if (this.ownedStocksStats) {
      return this.ownedStocksStats.profitOrLossAmount >= 0;
    }
  }
  stockChangeColor(): string {
    if (this.ownedStocksStats) {
      return this.isUserGained() ? 'positive-change' : 'negative-change';
    }
  }

  userHasThisStock(): boolean {
    return this.ownedStocksStats ? this.ownedStocksStats.noOfShares > 0 : false;
  }

  calculateOwnedStockInfo(): void {
    if (this.userOwnedStocks && this.stockInfo) {
      this.ownedStocksStats = {
        noOfShares: 0,
        totalOwned: 0,
        thisStockTotal: 0,
        averagePerShare: 0,
        percentPortfolio: 0,
        profitOrLossAmount: 0,
        profitOrLossPercent: 0,
      };
      for (const stock of this.userOwnedStocks) {
        this.ownedStocksStats.totalOwned +=
          Number(stock.avgPrice) * Number(stock.quantity);

        if (stock.tickerSymbol === this.stockInfo.tickerSymbol) {
          this.ownedStocksStats.noOfShares += Number(stock.quantity);
          this.ownedStocksStats.thisStockTotal +=
            Number(stock.avgPrice) * Number(stock.quantity);
        }
      }
      this.ownedStocksStats.averagePerShare =
        this.ownedStocksStats.thisStockTotal / this.ownedStocksStats.noOfShares;

      this.ownedStocksStats.percentPortfolio =
        (this.ownedStocksStats.thisStockTotal /
          this.ownedStocksStats.totalOwned) *
        100;

      const realTimePrice =
        this.ownedStocksStats.noOfShares * this.stockInfo.stockValue;

      this.ownedStocksStats.profitOrLossAmount =
        this.ownedStocksStats.thisStockTotal - // (total spent on this stock - real-time price)
        realTimePrice;

      this.ownedStocksStats.profitOrLossPercent =
        ((this.ownedStocksStats.averagePerShare - this.stockInfo.stockValue) / //  [(avg - real avg)/real avg]  * 100
          this.stockInfo.stockValue) *
        100;
    }
  }

  openSellOrBuyActionsModal(type: string): void {
    const stockInfo = this.stockInfo;
    const userInfo = this.userInfo;
    const dialogRef = this.dialog.open(SellOrBuyActionsComponent, {
      data: {
        type,
        stockInfo,
        userInfo,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // returned results
    });
  }
}
