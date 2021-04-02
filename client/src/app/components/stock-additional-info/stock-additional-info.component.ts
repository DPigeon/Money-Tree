import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from '../../interfaces/stock';
import { Observable } from 'rxjs';

export interface Follower {
  user: any;
  currentStockLoaded: Stock;
  errorMessage: any;
}
@Component({
  selector: 'app-stock-additional-info',
  templateUrl: './stock-additional-info.component.html',
  styleUrls: ['./stock-additional-info.component.scss'],
})
export class StockAdditionalInfoComponent {
  @Input() type: string;
  @Input() stockSymbol: string;
  @Input() userId: number;
  @Input() list$: Observable<any>;

  constructor(private router: Router) {}

  navigateToUserProfile(username: string): void {
    this.router.navigate([`/profile/${username}`]);
  }

  navigateToStockPage(symbol: string): void {
    this.router.navigate([`/stock-detail/${symbol}`]);
  }

  getTitleByType(): string {
    if (this.type === 'followersWithSameStock') {
      return `Followers who owns ${this.stockSymbol}`;
    } else if (this.type === 'topInvestors') {
      return `Top 10% Investors on ${this.stockSymbol}`;
    } else {
      return `People who own ${this.stockSymbol} also own these stocks (% of users/stock)`;
    }
  }
  getIconByType(): string {
    if (this.type === 'followersWithSameStock') {
      return 'group_add';
    } else if (this.type === 'topInvestors') {
      return 'trending_up';
    } else {
      return 'domain';
    }
  }
}
