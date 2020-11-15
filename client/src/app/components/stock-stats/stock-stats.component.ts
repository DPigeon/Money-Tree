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
    return this.stockInfo ? this.stockInfo.stats.open.toFixed(2) : '';
  }

  get high(): string | number {
    return this.stockInfo ? this.stockInfo.stats.high.toFixed(2) : '';
  }

  get low(): string | number {
    return this.stockInfo ? this.stockInfo.stats.low.toFixed(2) : '';
  }

  get volume(): string | number {
    return this.stockInfo ? this.stockInfo.stats.volume.toPrecision(3) : '';
  }

  get mktCap(): string | number {
    return this.stockInfo ? this.stockInfo.stats.mktCap.toFixed(2) : '';
  }

  get wh(): string | number {
    return this.stockInfo ? this.stockInfo.stats.wh.toFixed(2) : '';
  }

  get wl(): string | number {
    return this.stockInfo ? this.stockInfo.stats.wl.toFixed(2) : '';
  }

  get avgVolume(): string | number {
    return this.stockInfo ? this.stockInfo.stats.avgVolume.toPrecision(3) : '';
  }
}
