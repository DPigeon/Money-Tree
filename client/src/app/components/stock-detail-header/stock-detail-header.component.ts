import { Component, Input } from '@angular/core';
import { Stock } from './../../interfaces/stock';

@Component({
  selector: 'app-stock-detail-header',
  templateUrl: './stock-detail-header.component.html',
  styleUrls: ['./stock-detail-header.component.scss'],
})
export class StockDetailHeaderComponent {
  @Input() stockInfo: Stock;
  constructor() {}

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
}
