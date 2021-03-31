import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from 'src/app/store/store-facade.service';

export interface StockProfile {
  company: string;
  amount: string;
  gain_loss: number;
  price: string;
  change: number;
}
@Component({
  selector: 'app-user-owned-stock-profile',
  templateUrl: './user-owned-stock-profile.component.html',
  styleUrls: ['./user-owned-stock-profile.component.scss'],
})
export class UserOwnedStockProfileComponent implements OnChanges {
  @Input() currentUser: User;
  @Input() location: string;
  @Input() userOwnedStocks: Stock[];
  @Output() changeEarnings = new EventEmitter<{
    earnings: number;
    totalGain: number;
    positive: boolean;
  }>();
  displayedColumns: string[] = [
    'company',
    'amount',
    'gain_loss',
    'price',
    'change',
  ];
  userAlpacaPositions: AlpacaUserPosition[];
  public dataSource = new MatTableDataSource<StockProfile>([]);

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService
  ) {}
  ngOnChanges(): void {
    this.location === 'home'
      ? (this.displayedColumns = ['company', 'amount', 'gain_loss'])
      : (this.displayedColumns = [
          'company',
          'amount',
          'gain_loss',
          'price',
          'change',
        ]);

    if (this.currentUser) {
      this.storeFacade.loadAlpacaPositions(this.currentUser.id);
    }
    this.storeFacade.userAlpacaPositions$.subscribe((result) => {
      if (result) {
        this.userAlpacaPositions = result;
        this.tableDataGenerator();
      }
    });
  }
  tableDataGenerator(): void {
    let data: StockProfile[];
    data = [];
    if (this.userAlpacaPositions && this.userOwnedStocks) {
      let earnings = 0;
      let totalGain = 0;
      this.userAlpacaPositions.forEach((r) => {
        let amount = 0;
        let quantity = 0;
        let gain = 0;
        let price = 0;
        let change = 0;
        this.userOwnedStocks
          .filter((x) => x.tickerSymbol === r.symbol)
          .forEach((o) => {
            quantity += Number(o.quantity);
            amount += Number(o.quantity) * Number(o.avgPrice);
            earnings += amount;
            gain +=
              (Number(r.currentPrice) - Number(o.avgPrice)) *
              Number(o.quantity);
            change = Number(r.currentPrice) - Number(o.avgPrice);
            totalGain += gain;
          });
        price = amount / quantity;
        if (amount !== 0) {
          data.push({
            company: r.symbol,
            amount: amount.toFixed(2),
            gain_loss: gain,
            price: price.toFixed(2),
            change,
          });
        }
      });
      this.dataSource.data = data;
      this.changeEarnings.emit({
        earnings: earnings < 0 ? -1 * earnings : earnings,
        totalGain,
        positive: earnings > 0,
      });
    }
  }

  navigateToStockPage(symbol: string): void {
    this.router.navigate(['/stock-detail/' + symbol]);
  }
  stockChangeColor(e: number): string {
    return e > 0 ? 'positive-change' : 'negative-change';
  }
  formatStat(e: number): string {
    return e > 0 ? e.toFixed(2) : (e * -1).toFixed(2);
  }
}
