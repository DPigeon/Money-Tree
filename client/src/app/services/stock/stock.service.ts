import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stock } from 'src/app/interfaces/stock';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  // To be deleted
  stockInfo: Stock = {
    tickerSymbol: 'AC',
    companyName: 'Air Canada',
    industry: 'Transportation',
    volatility: 'High',
    stockChange: 4.27,
    stockChangePercent: 1.68,
    stockValue: 16.36,
  }

  constructor(private api: ApiService) { }

  loadStockInfo(stockTicker: string):Observable<Stock>{
    //http call
    return of(this.stockInfo);
  }
}
