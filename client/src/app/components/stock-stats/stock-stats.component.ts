import { Component, Input } from '@angular/core';
import { Stock } from './../../interfaces/stock';

@Component({
  selector: 'app-stock-stats',
  templateUrl: './stock-stats.component.html',
  styleUrls: ['./stock-stats.component.scss'],
})
export class StockStatsComponent {
  @Input() stockInfo: Stock;
  constructor() {}

  get open(): string  {
    return this.stockInfo ? this.stockInfo.stats.open ? this.stockInfo.stats.open.toFixed(2) : '' : '';
  }

  get high(): string  {
    return this.stockInfo ? this.stockInfo.stats.high ? this.stockInfo.stats.high.toFixed(2) : '' : '';
  }

  get low(): string  {
    return this.stockInfo ? this.stockInfo.stats.low ? this.stockInfo.stats.low.toFixed(2) : '' : '';
  }

  get volume(): string  {
    return this.stockInfo ?  this.stockInfo.stats.volume ? this.stockInfo.stats.volume.toPrecision(3) : '' : '';
  }

  get mktCap(): string  {
    return this.stockInfo ? this.stockInfo.stats.mktCap ? this.stockInfo.stats.mktCap.toFixed(2) : '' : '';
  }

  get stock52weekHigh(): string  {
    return this.stockInfo ? this.stockInfo.stats.stock52weekHigh ? this.stockInfo.stats.stock52weekHigh.toFixed(2) : '' : '';
  }

  get stock52weekLow(): string  {
    return this.stockInfo ? this.stockInfo.stats.stock52weekLow ? this.stockInfo.stats.stock52weekLow.toFixed(2) : '' : '';
  }

  get avgVolume(): string  {
    return this.stockInfo ? this.stockInfo.stats.avgVolume ? this.stockInfo.stats.avgVolume.toPrecision(3) : '' : '';
  }
}
