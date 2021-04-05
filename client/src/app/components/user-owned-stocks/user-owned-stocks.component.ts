import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { SellOrBuyActionsComponent } from '../sell-buy-stock/sell-buy-actions.component';

export interface OwnedStocksStats {
  noOfShares?: string;
  averagePerShare?: string;
  percentPortfolio?: string;
  thisStockTotal?: number;
  profitOrLossAmount?: string;
  profitOrLossPercent?: string;
}
@Component({
  selector: 'app-user-stocks',
  templateUrl: './user-owned-stocks.component.html',
  styleUrls: ['./user-owned-stocks.component.scss'],
})
export class UserOwnedStocksComponent implements OnInit, OnChanges {
  @Input() stockInfo: Stock;
  @Input() userInfo: User;
  @Input() alpacaPositions$: Observable<AlpacaUserPosition[]>;
  alpacaPositions: AlpacaUserPosition[];

  ownedStocksStats: OwnedStocksStats;

  constructor(public dialog: MatDialog) {}
  ngOnChanges(): void {
    this.calculateOwnedStockInfo();
    console.log('called');
  }
  ngOnInit(): void {
    this.alpacaPositions$.subscribe((data) => (this.alpacaPositions = data));
  }

  get stockSymbol(): string {
    return this.stockInfo ? this.stockInfo.tickerSymbol : '';
  }

  get stockCompanyName(): string {
    return this.stockInfo ? this.stockInfo.companyName : '';
  }

  get userStockNoOfShares(): number {
    return this.ownedStocksStats ? Number(this.ownedStocksStats.noOfShares) : 0;
  }

  get userStockAvgShare(): string {
    return this.ownedStocksStats
      ? Number(this.ownedStocksStats.averagePerShare).toFixed(2)
      : '0';
  }

  get userStockPortfolio(): string {
    return this.ownedStocksStats
      ? Number(this.ownedStocksStats.percentPortfolio).toFixed(2)
      : '0';
  }

  get userStockTotalValue(): string {
    return this.ownedStocksStats
      ? Number(this.ownedStocksStats.thisStockTotal).toFixed(2)
      : '0';
  }

  get profitOrLossAmount(): string {
    if (this.ownedStocksStats) {
      return Math.abs(Number(this.ownedStocksStats.profitOrLossAmount)).toFixed(
        2
      );
    }
    return '0';
  }

  get profitOrLossPercent(): string {
    if (this.ownedStocksStats) {
      return Math.abs(
        Number(this.ownedStocksStats.profitOrLossPercent)
      ).toFixed(2);
    }
    return '0';
  }

  isUserGained(): boolean {
    if (this.ownedStocksStats) {
      return Number(this.ownedStocksStats.profitOrLossAmount) >= 0;
    }
  }
  stockChangeColor(): string {
    if (this.ownedStocksStats) {
      return this.isUserGained() ? 'positive-change' : 'negative-change';
    }
  }

  userHasThisStock(): boolean {
    return this.ownedStocksStats
      ? this.ownedStocksStats.noOfShares !== '0'
      : false;
  }

  calculateOwnedStockInfo(): void {
    if (this.alpacaPositions) {
      this.ownedStocksStats = {
        noOfShares: '0',
        averagePerShare: '0',
        percentPortfolio: '0',
        thisStockTotal: 0,
        profitOrLossAmount: '0',
        profitOrLossPercent: '0',
      };
      let totalStocksValue = 0;
      for (const position of this.alpacaPositions) {
        totalStocksValue += Number(position.currentValue);
        if (position.symbol === this.stockInfo.tickerSymbol) {
          this.ownedStocksStats.thisStockTotal += Number(position.currentValue);
          this.ownedStocksStats.noOfShares = position.qty;
          this.ownedStocksStats.averagePerShare = Number(
            position.avgPrice
          ).toFixed(2);
          this.ownedStocksStats.profitOrLossPercent = (
            Number(position.gainPercentage) * 100
          ).toFixed(2);
          this.ownedStocksStats.profitOrLossAmount = Number(
            position.gainAmount
          ).toFixed(2);
        }
      }
      this.ownedStocksStats.percentPortfolio = (
        (this.ownedStocksStats.thisStockTotal / totalStocksValue) *
        100
      ).toFixed(2);
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
