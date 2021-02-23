import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from 'src/app/interfaces/stock';
import { ApiService } from '../api/api.service';
import { MarketClock } from './../../interfaces/market-clock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private api: ApiService) {}

  loadStockInfo(stockTicker: string): Observable<Stock> {
    return this.api
      .get('stock/batch/' + stockTicker.toUpperCase())
      .pipe(map((res: Response) => this.IEXtoModel(res.body)));
  }

  loadMarketClock(userId: number): Observable<MarketClock> {
    return this.api
      .get('alpaca/market-status/' + userId)
      .pipe(map((res: Response) => this.marketClockFormatter(res)));
  }

  loadStockHistoricalData(
    stockTicker: string,
    range: string,
    interval: string
  ): Observable<any> {
    return this.api
      .getStockHistoricalData(
        'stockmarket/yahoochart/' +
          stockTicker.toUpperCase() +
          '?range=' +
          range +
          '&interval=' +
          interval
      )
      .pipe(map((res: Response) => res.body));
  }

  getUserOwnedStocks(userId: number): Observable<Stock[]> {
    return this.api
      .get('stock/owned-stocks/' + userId)
      .pipe(map((res: Response) => this.stockListFormatter(res)));
  }

  // This will need to be discussed: formatting responses frontend vs backend, same models?
  IEXtoModel(iex: any): Stock {
    const stock: Stock = {
      tickerSymbol: iex.company.symbol,
      companyName: iex.company.companyName,
      industry: iex.company.industry,
      volatility: 'low',
      stockChange: iex.book.quote.change,
      stockChangePercent: iex.book.quote.changePercent * 100,
      stockValue: iex.book.quote.latestPrice,
      logo: iex.logo.url,
      stats: {
        open: iex.book.quote.open,
        high: iex.book.quote.high,
        low: iex.book.quote.low,
        volume: iex.book.quote.volume,
        mktCap: iex.book.quote.marketCap,
        stock52weekHigh: iex.book.quote.week52High,
        stock52weekLow: iex.book.quote.week52Low,
        avgVolume: iex.book.quote.avgTotalVolume,
      },
    };
    return stock;
  }
  marketClockFormatter(response: any): MarketClock {
    const fromattedMarketClock: MarketClock = {
      isOpen: response.body.isOpen,
      nextClose: response.body.nextClose,
      nextOpen: response.body.nextOpen,
      timestamp: response.body.timestamp,
    };
    return fromattedMarketClock;
  }

  stockListFormatter(response: any): Stock[] {
    const result: Stock[] = [];
    for (const fetchedStock of response.body) {
      result.push({
        companyName: fetchedStock.companyName,
        tickerSymbol: fetchedStock.symbol,
        since: fetchedStock.since,
        avgPrice: fetchedStock.avgPrice,
        quantity: fetchedStock.quantity,
      });
    }
    return result;
  }
}
