import { Component, Input } from '@angular/core';
import { Stock } from './../../interfaces/stock';

@Component({
  selector: 'app-stock-detail-header',
  templateUrl: './stock-detail-header.component.html',
  styleUrls: ['./stock-detail-header.component.scss']
})
export class StockDetailHeaderComponent {
  @Input() stockInfo: Stock;
  constructor() { }

  get stockValue() {
    return this.stockInfo ? this.stockInfo.stockValue : 0;
  }

  stockChangeColor() {
    if (this.stockInfo) {
      const changeValue = this.stockInfo.stockChange;
      if (changeValue === 0) {
        return '';
      }
      else {
        return changeValue < 0 ? 'negative-change' : 'positive-change';
      }
    }
    return '';
  }

  stockInfoFormatter() {
    if (this.stockInfo) {
      let sign = this.stockInfo.stockChange <= 0 ? '' : '+';
      return (sign + this.stockInfo.stockChange + "(" + this.stockInfo.stockChangePercent + "%)");
    }
    return '';
  }
}
