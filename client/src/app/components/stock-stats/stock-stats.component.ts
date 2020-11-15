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

  get open(): string | number {
    return this.stockInfo ? this.stockInfo.stats.open : '';
  }

  get high(): string | number {
    return this.stockInfo ? this.stockInfo.stats.high : '';
  }

  get low(): string | number {
    return this.stockInfo ? this.stockInfo.stats.low : '';
  }

  get volume(): string | number {
    return this.stockInfo ? this.stockInfo.stats.volume : '';
  }

  get mktCap(): string | number {
    return this.stockInfo ? this.stockInfo.stats.mktCap : '';
  }

  get wh(): string | number {
    return this.stockInfo ? this.stockInfo.stats.wh : '';
  }

  get wl(): string | number {
    return this.stockInfo ? this.stockInfo.stats.wl : '';
  }

  get avgVolume(): string | number {
    return this.stockInfo ? this.stockInfo.stats.avgVolume : '';
  }
}
