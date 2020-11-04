import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateToStockDetailPage(ticker: string): Promise<unknown> {
    return browser.get(browser.baseUrl + '/stock-detail/' + ticker) as Promise<
      unknown
    >;
  }

  getStockPrice(): Promise<string> {
    return element(by.css('.stock-value')).getText() as Promise<string>;
  }

  getStockPriceValue(): Promise<number> {
    return element(by.css('.stock-change'))
      .getText()
      .then((res) => Number(res.replace(/[^0-9.-]+/g, ''))) as Promise<number>;
  }

  getStockPriceChange(): ElementFinder {
    return element(by.css('.stock-change'));
  }
}
