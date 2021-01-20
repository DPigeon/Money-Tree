import { Component } from '@angular/core';

@Component({
  selector: 'app-user-stocks',
  templateUrl: './user-owned-stocks.component.html',
  styleUrls: ['./user-owned-stocks.component.scss'],
})
export class UserOwnedStocksComponent {
  constructor() {}

  get userStockNoOfShares(): number {
    return 14;
  }

  get userStockAvgShare(): number {
    return 16.2;
  }

  get userStockPortfolio(): string {
    return '%23';
  }

  get userStockTotalValue(): string {
    return '$ 250.24';
  }

  get userStockChange(): string {
    return '$ 24.22';
  }

  get userStockPercentageChange(): string {
    return '%8.08';
  }

  isUserStockIncrease(): boolean {
    return true;
  }

  displayArrowChange(): string {
    // arrow_upward or arrow_downward
    return 'arrow_upward';
  }

  setPrecisionAbbreviation(stat: number): string {
    if (stat >= 1000000000000) {
      // more or equal to 1 trillion
      return (stat / 1000000000000).toFixed(2) + ' T';
    } else if (stat >= 1000000000) {
      // more or equal to 1 billion
      return (stat / 1000000000).toFixed(2) + ' B';
    } else if (stat >= 1000000) {
      return (stat / 1000000).toFixed(2) + ' M'; // more or equal to 1 million
    } else if (stat >= 10000) {
      return (stat / 10000).toFixed(2) + ' K'; // more or equal to 10 thousand
    } else {
      return stat.toFixed(2);
    }
  }
}
