import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from 'src/app/interfaces/stock';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private api: ApiService) {}

  loadStockInfo(stockTicker: string): Observable<Stock> {
    return this.api
      .get('stockmarket/batch/' + stockTicker.toUpperCase())
      .pipe(map((res: any) => this.IEXtoModel(res)));
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
    };
    return stock;
  }
}
