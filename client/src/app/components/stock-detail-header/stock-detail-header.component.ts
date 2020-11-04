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

  get stockValue(): number {
    return this.stockInfo ? this.stockInfo.stockValue : 0;
  }

  stockChangeColor(): string {
    if (this.stockInfo) {
      return this.stockInfo.stockChange < 0
        ? 'negative-change'
        : 'positive-change';
    }
    return '';
  }

  stockInfoFormatter(): string {
    if (this.stockInfo) {
      const sign = this.stockInfo.stockChange < 0 ? '' : '+';
      return (
        sign +
        this.stockInfo.stockChange +
        '(' +
        this.stockInfo.stockChangePercent +
        '%)'
      );
    }
    return '';
  }
}
