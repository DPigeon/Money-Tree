import { browser, by, element, ElementFinder } from 'protractor';

export class StockDetail {
  getStockSearchBar(): ElementFinder {
    return element(by.id('searchbox'));
  }

  getFirstSearchResult(): Promise<string> {
    return element
      .all(by.css('.option-container'))
      .get(0)
      .getText() as Promise<string>;
  }

  navigateToStockDetailPage(ticker: string): Promise<unknown> {
    return browser.get(
      browser.baseUrl + '/stock-detail/' + ticker
    ) as Promise<unknown>;
  }

  getStockStatOpen(): string {
    return by.id('stat-open').toString();
  }

  getStockStatHigh(): string {
    return by.id('stat-high').toString();
  }

  getStockStatLow(): string {
    return by.id('stat-low').toString();
  }
  getStockStatVol(): string {
    return by.id('stat-vol').toString();
  }

  getStockStatMktCap(): string {
    return by.id('stat-mkt-cap').toString();
  }

  getStockStat52weekLow(): string {
    return by.id('stat-week-low').toString();
  }

  getStockStat52weekHigh(): string {
    return by.id('stat-week-high').toString();
  }

  getStockStatAvgVol(): string {
    return by.id('stat-avg-Vol').toString();
  }
  getOpenMarketChip(): ElementFinder {
    return element(by.id('chip-open-market'));
  }
  getClosedMarketChip(): ElementFinder {
    return element(by.id('chip-closed-market'));
  }
  getMarketNextOpenMsg(): ElementFinder {
    return element(by.id('market-next-open-msg'));
  }
}
