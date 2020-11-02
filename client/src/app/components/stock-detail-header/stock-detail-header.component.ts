import { Component, OnInit, Input } from '@angular/core';
import { Stock } from './../../interfaces/stock';

@Component({
  selector: 'app-stock-detail-header',
  templateUrl: './stock-detail-header.component.html',
  styleUrls: ['./stock-detail-header.component.scss']
})
export class StockDetailHeaderComponent implements OnInit{
  @Input() stockInfo: Stock;
  constructor() { }

  ngOnInit(): void {}

  get stockValue() {
    return this.stockInfo ? this.stockInfo.stockValue : 0;
  }

  stockChangeColor() {
    return this.stockInfo && this.stockInfo.stockChange < 0 ? 'negative-change' : 'positive-change';
  }

  stockInfoFormatter() {
    if(this.stockInfo) {
      let sign = this.stockInfo.stockChange < 0 ? '-' : '+';
      return sign + this.stockInfo.stockChange + "("+ this.stockInfo.stockChangePercent+"%)";
    }
    return '';
  }
}
