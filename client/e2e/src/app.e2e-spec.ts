import { AppPage } from './app.po';
import { UserAuthPage } from './user-auth.po';
import { browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;
  let authentication: UserAuthPage;

  beforeEach(() => {
    page = new AppPage();
    authentication = new UserAuthPage();
    authentication.authenticateUser();
    browser.sleep(1000);
  });

  afterEach(() => {
    authentication.cleanAuthenticatedUser();
    browser.sleep(1000);
  });

  it('should display stock price', () => {
    browser.sleep(2000);
    page.navigateToStockDetailPage('AAPL');
    const stockPrice = page.getStockPrice();
    // stock value
    expect(!!stockPrice).toBeTruthy(); // assures the value exists and is not 0
    expect(stockPrice).toMatch(/^\$[0-9]+(\.[0-9][0-9])?$/); // assures that the value is in format '$xxx.xx'
    // stock change
    const stockChange = page.getStockPriceChange();
    const arrowDisplayUp = page.getArrowUp().getCssValue('display');
    const arrowDisplayDown = page.getArrowDown().getCssValue('display');
    page.getStockPriceValue().then((value) => {
      let regEx;
      let expectedString;
      let expectedArrowUpDisplay;
      let expectedArrowDownDisplay;
      if (value > 0) {
        regEx = new RegExp(
          /^\+[0-9]+(\.[0-9][0-9])?\s\([0-9]+(\.[0-9][0-9])?\%\)/
        ); // assure that the value is '-xxx.xx (x.xx%)
        expectedString = 'stock-change positive-change';
        expectedArrowUpDisplay = 'block';
        expectedArrowDownDisplay = 'none';
      } else if (value === 0) {
        regEx = new RegExp(/0\s\(0\%\)/gm); // assure that the value is '0 (0%)'
        expectedString = 'stock-change';
        expectedArrowUpDisplay = 'none';
        expectedArrowDownDisplay = 'none';
      } else if (value < 0) {
        regEx = new RegExp(
          /^\-[0-9]+(\.[0-9][0-9])?\s\(-[0-9]+(\.[0-9][0-9])?\%\)/
        );
        expectedString = 'stock-change negative-change';
        expectedArrowUpDisplay = 'none';
        expectedArrowDownDisplay = 'block';
      }
      expect(stockChange.getAttribute('class')).toBe(expectedString);
      expect(stockChange.getText()).toMatch(regEx);
      expect(arrowDisplayUp).toMatch(expectedArrowUpDisplay);
      expect(arrowDisplayDown).toMatch(expectedArrowDownDisplay);
    });
  });

  it('should display stock industry', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockIndustry()).toBeTruthy();
  });
});
