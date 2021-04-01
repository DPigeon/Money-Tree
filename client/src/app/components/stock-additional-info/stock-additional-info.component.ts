import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Component, Input, OnInit } from '@angular/core';
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
export class StockAdditionalInfoComponent implements OnInit {
  @Input() type: string;
  @Input() stockSymbol: string;
  userId: number;

  topInvestors$: Observable<User[]> = this.storeFacade.topInvestorsOnAStock$;
  followersWithSameStock$: Observable<User[]> = this.storeFacade
    .followersWithSameStock$;
  stockPercentages: Observable<StockPercentage[]> = this.storeFacade
    .stocksOwnedByUsersOwnThisStock$;

  list: any = [
    { firstName: 'Marwan', lastName: 'Ayadi' },
    { firstName: 'Razine', lastName: 'Bensari' },
    { firstName: 'Arthur', lastName: 'Tourneyrie' },
    { firstName: 'Alessandro', lastName: 'Kreslin' },
    { firstName: 'David ', lastName: 'Pigeon' },
    { firstName: 'Abdulrahim', lastName: 'Mansour' },
    { firstName: 'Walter', lastName: 'Fleury' },
    { firstName: 'Hossein', lastName: 'Noor' },
    { firstName: 'Lindsay', lastName: 'Bangs' },
  ];

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService
  ) {}
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    console.log(`userId is now: ${this.userId}`);

    switch (this.type) {
      case 'topInvestors':
        this.storeFacade.loadTopInvestorsOnAStock(this.stockSymbol);
        break;
      case 'followersWithSameStock':
        this.storeFacade.loadFollowersWithSameStock(24, this.stockSymbol);
        break;
      case 'stockPercentages':
        this.storeFacade.loadStocksOwnedByUsersOwnThisStock(this.stockSymbol);
        break;
    }
  }

  navigateToadditionalProfile(entityId: string, type: string): void {
    if (type === 'followers' || type === 'investors') {
      // to be changed to prolipe page
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/stock-detail/' + entityId]);
    }
  }
  getTitleByType(): string {
    if (this.type === 'followersWithSameStock') {
      return `Followers who owns ${this.stockSymbol}:`;
    } else if (this.type === 'topInvestors') {
      return `Top 10% Investors on ${this.stockSymbol}:`;
    } else {
      return 'People who owns this stock also own these stocks:';
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

  show(): void {
    debugger;
    console.log(`${this.userId}`);
    console.log(`${this.stockSymbol}`);
    this.storeFacade.loadTopInvestorsOnAStock(this.stockSymbol);
    this.storeFacade.loadFollowersWithSameStock(
      this.userId,
      this.stockSymbol
    );
    this.storeFacade.loadStocksOwnedByUsersOwnThisStock(this.stockSymbol);
  }
}
