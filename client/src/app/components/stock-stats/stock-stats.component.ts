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

  get stockOpenPrice(): string {
    return this.stockInfo && this.stockInfo.stats && this.stockInfo.stats.open
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.open)
      : 'N/A';
  }

  get stockHighPrice(): string {
    return this.stockInfo && this.stockInfo.stats && this.stockInfo.stats.high
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.high)
      : 'N/A';
  }

  get stockLowPrice(): string {
    return this.stockInfo && this.stockInfo.stats && this.stockInfo.stats.low
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.low)
      : 'N/A';
  }

  get stockVolume(): string {
    return this.stockInfo && this.stockInfo.stats && this.stockInfo.stats.volume
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.volume)
      : 'N/A';
  }

  get stockMktCap(): string {
    return this.stockInfo && this.stockInfo.stats && this.stockInfo.stats.mktCap
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.mktCap)
      : 'N/A';
  }

  get stock52weekHigh(): string {
    return this.stockInfo &&
      this.stockInfo.stats &&
      this.stockInfo.stats.stock52weekHigh
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.stock52weekHigh)
      : 'N/A';
  }

  get stock52weekLow(): string {
    return this.stockInfo &&
      this.stockInfo.stats &&
      this.stockInfo.stats.stock52weekLow
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.stock52weekLow)
      : 'N/A';
  }

  get stockAvgVolume(): string {
    return this.stockInfo &&
      this.stockInfo.stats &&
      this.stockInfo.stats.avgVolume
      ? this.setPrecisionAbbreviation(this.stockInfo.stats.avgVolume)
      : 'N/A';
  }

  setPrecisionAbbreviation(stat: number): string {
    if (stat >= 1000000000000) {  // more or equal to 1 trillion
      return (stat / 1000000000000).toFixed(2) + ' T';
    } else if (stat >= 1000000000) {  // more or equal to 1 billion
      return (stat / 1000000000).toFixed(2) + ' B';
    } else if (stat >= 1000000) {
      return (stat / 1000000).toFixed(2) + ' M';  // more or equal to 1 million
    } else if (stat >= 10000) {
      return (stat / 10000).toFixed(2) + ' K';  // more or equal to 10 thousand
    } else {
      return stat.toFixed(2);
    }
  }
}
