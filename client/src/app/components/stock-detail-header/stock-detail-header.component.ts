import { Component, Input } from '@angular/core';
import { Stock } from './../../interfaces/stock';
import { StockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-stock-detail-header',
  templateUrl: './stock-detail-header.component.html',
  styleUrls: ['./stock-detail-header.component.scss'],
})
export class StockDetailHeaderComponent {
  @Input() stockInfo: Stock;
  // will be moved to the parent component in future commits
  marketStatus: any = null;
  constructor(stockService: StockService) {
  this.marketStatus = stockService.loadMarketClock().subscribe((data)=> console.log(data));
  }
  
  get companyLogo(): string {
    return this.stockInfo ? 'url(' + this.stockInfo.logo + ')' : '';
  }

  get companySymbol(): string {
    return this.stockInfo ? this.stockInfo.tickerSymbol : '';
  }

  get companyName(): string {
    return this.stockInfo ? this.stockInfo.companyName : '';
  }

  get stockValue(): string {
    return this.stockInfo ? this.stockInfo.stockValue.toFixed(2) : '';
  }
  get stockIndustry(): string {
    return this.stockInfo ? this.stockInfo.industry : '';
  }

  stockChangeColor(): string {
    if (this.stockInfo && this.stockInfo.stockChange !== 0) {
      return this.stockInfo.stockChange < 0
        ? 'negative-change'
        : 'positive-change';
    }
    return '';
  }

  stockInfoFormatter(): string {
    if (this.stockInfo) {
      const sign = this.stockInfo.stockChange <= 0 ? '' : '+';
      return (
        sign +
        this.stockInfo.stockChange.toFixed(2) +
        ' (' +
        this.stockInfo.stockChangePercent.toFixed(2) +
        '%)'
      );
    }
    return '';
  }
  marketStatusChip(): boolean { 
    return this.marketStatus;
  }
}
