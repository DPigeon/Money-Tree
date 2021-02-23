import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

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
  showStockChart = false;
  ticker = '';
  chartRange = '1d';
  chartInterval = '5m';
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    let ticker = this.route.snapshot.paramMap.get('ticker');
    this.storeFacade.loadCurrentStock(ticker);
    this.storeFacade.loadMarketClock(Number(localStorage.getItem('userId')));
    this.storeFacade.loadUserOwnedStocks(
      Number(localStorage.getItem('userId'))
    );
    this.storeFacade.loadCurrentStockHistoricalData(
      this.ticker,
      this.chartRange,
      this.chartInterval
    );
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
