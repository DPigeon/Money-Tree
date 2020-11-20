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

  get open(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.open) {
        return this.stockInfo.stats.open.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get high(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.high) {
        return this.stockInfo.stats.high.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get low(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.low) {
        return this.stockInfo.stats.low.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get volume(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.volume) {
        return this.stockInfo.stats.volume.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get mktCap(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.mktCap) {
        return this.stockInfo.stats.mktCap.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get stock52weekHigh(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.stock52weekHigh) {
        return this.stockInfo.stats.stock52weekHigh.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get stock52weekLow(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.stock52weekLow) {
        return this.stockInfo.stats.stock52weekLow.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }

  get avgVolume(): string {
    if (!!this.stockInfo) {
      if (!!this.stockInfo.stats.avgVolume) {
        return this.stockInfo.stats.avgVolume.toFixed(2);
      } else {
        return 'N/A';
      }
    } else {
      return '';
    }
  }
}
