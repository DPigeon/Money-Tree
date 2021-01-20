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
}
