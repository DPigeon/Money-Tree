import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display stock price', () => {
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

  it('should display stock stats Open', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatOpen()).toBeTruthy();
  });

  it('should display stock stats High', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatHigh()).toBeTruthy();
  });

  it('should display stock stats Low', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatLow()).toBeTruthy();
  });

  it('should display stock stats Volume', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatVol()).toBeTruthy();
  });

  it('should display stock stats Mkt Cap', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatMktCap()).toBeTruthy();
  });

  it('should display stock stats WH', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatWh()).toBeTruthy();
  });

  it('should display stock stats WL', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatWl()).toBeTruthy();
  });

  it('should display stock stats Avg Volume', () => {
    page.navigateToStockDetailPage('AAPL');
    expect(page.getStockStatAvgVol()).toBeTruthy();
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
