import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs/operators';

export interface ChartDataOptions {
  range: string;
  interval: string;
}

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
})
export class StockDetailComponent implements OnInit {
  stockHistoricalData$ = this.storeFacade.stockHistoricalDataLoaded$;
  stockInfo$ = this.storeFacade.currentStockLoaded$;
  marketClock$ = this.storeFacade.currentMarketClock$;
  userInfo$ = this.storeFacade.currentUser$;
  userOwnedStocks$ = this.storeFacade.userOwnedStocks$;
  stocksOwnedByUsersOwnThisStock$ = this.storeFacade
    .stocksOwnedByUsersOwnThisStock$;
  followersWithSameStock$ = this.storeFacade.followersWithSameStock$;
  topInvestorsOnAStock$ = this.storeFacade.topInvestorsOnAStock$;

  showStockChart = false;
  userId = Number(localStorage.getItem('userId'));
  ticker = '';
  chartRange = '1d';
  chartInterval = '5m';
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
    this.storeFacade.loadCurrentStock(this.ticker);
    this.storeFacade.loadMarketClock(this.userId);
    this.storeFacade.loadUserOwnedStocks(this.userId);
    this.storeFacade.loadCurrentStockHistoricalData(
      this.ticker,
      this.chartRange,
      this.chartInterval
    );
    if (!!this.stockHistoricalData$) {
      this.showStockChart = true;
    }
    this.storeFacade.loadTopInvestorsOnAStock(this.ticker);
    this.storeFacade.loadFollowersWithSameStock(this.userId, this.ticker);
    this.storeFacade.loadStocksOwnedByUsersOwnThisStock(this.ticker);

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.ticker = this.route.snapshot.paramMap.get('ticker');
        this.storeFacade.loadCurrentStock(this.ticker);
        this.storeFacade.loadCurrentStockHistoricalData(
          this.ticker,
          this.chartRange,
          this.chartInterval
        );
        this.storeFacade.loadTopInvestorsOnAStock(this.ticker);
        this.storeFacade.loadFollowersWithSameStock(this.userId, this.ticker);
        this.storeFacade.loadStocksOwnedByUsersOwnThisStock(this.ticker);
      });
  }
  changeChartRangeInterval(chartViewOptions: ChartDataOptions): void {
    this.storeFacade.loadCurrentStockHistoricalData(
      this.ticker,
      chartViewOptions.range,
      chartViewOptions.interval
    );
  }
}
