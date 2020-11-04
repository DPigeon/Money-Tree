import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display stock price', () => {
    page.navigateToStockDetailPage('AC');
    let stockPrice = page.getStockPrice();
    // stock value
    expect(!!stockPrice).toBeTruthy(); // assures the value exists and is not 0
    expect(stockPrice).toMatch(/^\$[0-9]+(\.[0-9][0-9])?$/); // assures that the value is in format '$xxx.xx'

    //stock change
    let stockChange = page.getStockPriceChange();
    page.getStockPriceValue().then(value =>{
      let regEx;
      let expectedString;
      if( value > 0 ) {
        regEx = new RegExp(/^\+[0-9]+(\.[0-9][0-9])?\([0-9]+(\.[0-9][0-9])?\%\)/); // assure that the value is '-xxx.xx(x.xx%)
        expectedString = 'stock-change positive-change';
      } else {
        regEx = new RegExp(/^\-[0-9]+(\.[0-9][0-9])?\([0-9]+(\.[0-9][0-9])?\%\)/);
        expectedString = 'stock-change negative-change';
      }
      expect(stockChange.getAttribute('class')).toBe(expectedString);
      expect(stockChange.getText()).toMatch(regEx);
    })
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
