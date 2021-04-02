import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from '../../interfaces/stock';
import { StockPercentage } from './../../interfaces/stock-percentage';
import { User } from 'src/app/interfaces/user';
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
export class StockAdditionalInfoComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Input() stockSymbol: string;
  @Input() userId: number;
  list$: Observable<any>;

  topInvestors$: Observable<User[]> = this.storeFacade.topInvestorsOnAStock$;
  followersWithSameStock$: Observable<User[]> = this.storeFacade
    .followersWithSameStock$;
  stockPercentages$: Observable<StockPercentage[]> = this.storeFacade
    .stocksOwnedByUsersOwnThisStock$;

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService
  ) {}
  ngOnInit(): void {
    this.generateData();
  }

  ngOnChanges(): void {
    this.generateData();
  }

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

  generateData(): void {
    switch (this.type) {
      case 'topInvestors':
        this.storeFacade.loadTopInvestorsOnAStock(this.stockSymbol);
        this.list$ = this.topInvestors$;
        console.log('top investors loaded;');
        break;
      case 'followersWithSameStock':
        this.storeFacade.loadFollowersWithSameStock(
          this.userId,
          this.stockSymbol
        );
        this.list$ = this.followersWithSameStock$;
        break;
      case 'stockPercentages':
        this.storeFacade.loadStocksOwnedByUsersOwnThisStock(this.stockSymbol);
        this.list$ = this.stockPercentages$;
        break;
    }
  }
}
