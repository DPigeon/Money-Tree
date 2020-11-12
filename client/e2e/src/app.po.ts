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
      .then((res) => Number(res.match(/^([+]|[-])?[0-9]+\.[0-9][0-9]|^0/g))) as Promise<number>;
      // This regex matches a signed number or 0 only
  }

  getStockPriceChange(): ElementFinder {
    return element(by.css('.stock-change'));
  }
  getArrowUp(): ElementFinder {
    return element(by.css('#up-arrow'));
  }
  getArrowDown(): ElementFinder {
    return element(by.css('#down-arrow'));
  }

  getStockIndustry() {
    return by.tagName("mat-chip").toString();
  }
}
