import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User, UserProfile } from 'src/app/interfaces/user';

export interface StockProfile {
  company: string;
  amount: string;
  gain_loss: string;
  price: string;
  change: string;
}
@Component({
  selector: 'app-user-owned-stock-profile',
  templateUrl: './user-owned-stock-profile.component.html',
  styleUrls: ['./user-owned-stock-profile.component.scss'],
})
export class UserOwnedStockProfileComponent implements OnChanges {
  @Input() currentUser: User | UserProfile;
  @Input() location: string;
  @Input() userOwnedStocks: Stock[];
  @Input() alpacaPositions: AlpacaUserPosition[];

  displayedColumns: string[] = [
    'company',
    'amount',
    'gain_loss',
    'price',
    'change',
  ];

  public dataSource = new MatTableDataSource<StockProfile>([]);

  constructor(private router: Router) {}
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

    if (this.alpacaPositions) {
      this.tableDataGenerator();
    }
  }
  tableDataGenerator(): void {
    let data: StockProfile[];
    data = [];
    if (this.alpacaPositions) {
      for (const p of this.alpacaPositions) {
        data.push({
          company: p.symbol,
          amount: Number(p.currentValue).toFixed(2),
          gain_loss: Number(p.gainAmount).toFixed(2),
          price: Number(p.avgPrice).toFixed(2),
          change: Number(p.change).toFixed(2),
        });
      }
      this.dataSource.data = data;
    }
  }

  navigateToStockPage(symbol: string): void {
    this.router.navigate(['/stock-detail/' + symbol]);
  }
  stockChangeColor(e: number): string {
    return e > 0 ? 'positive-change' : 'negative-change';
  }
  formatStat(e: number): string {
    return e.toString();
  }
}
