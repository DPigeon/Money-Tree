import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';

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
  displayedColumns: string[] = [
    'company',
    'amount',
    'gain_loss',
    'price',
    'change',
  ];
  public dataSource = new MatTableDataSource<StockProfile>([]);

  constructor(private router: Router, private userService: UserService) {}
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
    let data: StockProfile[] = [];
    this.userService
      .getUserAlpacaPosition(this.currentUser.id)
      .then((result) => {
        result.forEach((r) => {
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
              gain +=
                (Number(r.currentPrice) - Number(o.avgPrice)) *
                Number(o.quantity);
              change = Number(r.currentPrice) - Number(o.avgPrice);
            });
          price = amount / quantity;

          data.push({
            company: r.symbol,
            amount: amount.toFixed(2),
            gain_loss: gain,
            price: price.toFixed(2),
            change,
          });
        });
        this.dataSource.data = data;
      });
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
