import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display stock price', () => {
    page.navigateToStockDetailPage('AC');
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
          /^\+[0-9]+(\.[0-9][0-9])?\([0-9]+(\.[0-9][0-9])?\%\)/
        ); // assure that the value is '-xxx.xx(x.xx%)
        expectedString = 'stock-change positive-change';
        expectedArrowUpDisplay = 'block';
        expectedArrowDownDisplay = 'none';
      }
      else if (value === 0) {
        regEx = new RegExp(
          /0\(0\%\)/gm
        ); // assure that the value is '0(0%)'
        expectedString = 'stock-change';
        expectedArrowUpDisplay = 'none';
        expectedArrowDownDisplay = 'none';
      }
      else if (value < 0) {
        regEx = new RegExp(
          /^\-[0-9]+(\.[0-9][0-9])?\([0-9]+(\.[0-9][0-9])?\%\)/
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

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
