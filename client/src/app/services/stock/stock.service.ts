import { StockPercentage } from './../../interfaces/stock-percentage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from 'src/app/interfaces/stock';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import { ApiService } from '../api/api.service';
import { MarketClock } from './../../interfaces/market-clock';
import { DataFormatter } from './../../utilities/data-formatters';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private api: ApiService, private dataFormatter: DataFormatter) {}

  loadStockInfo(stockTicker: string): Observable<Stock> {
    return this.api
      .get('stock/batch/' + stockTicker.toUpperCase())
      .pipe(map((res: Response) => this.dataFormatter.IEXtoModel(res.body)));
  }

  loadMarketClock(userId: number): Observable<MarketClock> {
    return this.api
      .get('alpaca/market-status/' + userId)
      .pipe(
        map((res: Response) => this.dataFormatter.marketClockFormatter(res))
      );
  }

  loadStockHistoricalData(
    stockTicker: string,
    range: string,
    interval: string
  ): Observable<StockHistory> {
    return this.api
      .get(
        'stock/yahoochart/' +
          stockTicker.toUpperCase() +
          '?range=' +
          range +
          '&interval=' +
          interval
      )
      .pipe(
        map((res: Response) => this.dataFormatter.YahooDataToModel(res.body))
      );
  }

  getUserOwnedStocks(userId: number): Observable<Stock[]> {
    return this.api
      .get('stock/owned-stocks/' + userId)
      .pipe(map((res: Response) => this.dataFormatter.stockListFormatter(res)));
  }

  getStocksOwnedByUsersOwnsThisStock(
    thisStockSymbol: string
  ): Observable<StockPercentage[]> {
    return this.api
      .get(`stock/people-who-own-also-own/${thisStockSymbol}`)
      .pipe(
        map((res: Response) =>
          this.dataFormatter.stockPercentageFormatter(res.body)
        )
      );
  }
}
