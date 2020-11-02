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

  stockChangeColor() {
    return this.stockInfo.stockChange < 0 ? 'negative-change' : 'positive-change';
  }
  stockInfoFormatter() {
    let sign = this.stockInfo.stockChange < 0 ? '-' : '+';
    return sign + this.stockInfo.stockChange + "("+ this.stockInfo.stockChangePercent+"%)";
  }
}
