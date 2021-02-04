import { browser } from 'protractor';
import { UserAuthPage } from './user-auth.po';
import { StockDetail } from './stock-detail.po';

describe('stock detail page system test', () => {
  let page: StockDetail;
  let authentication: UserAuthPage;

  beforeEach(() => {
    page = new StockDetail();
    authentication = new UserAuthPage();
    authentication.authenticateUser();
    browser.sleep(1000);
  });

  afterEach(() => {
    authentication.cleanAuthenticatedUser();
    browser.sleep(1000);
  });

  it('should search for a stock', () => {
    browser.sleep(2000);
    const searchbar = page.getStockSearchBar();
    searchbar.sendKeys('aapl');
    const firstSearchResult = page.getFirstSearchResult();
    browser.sleep(2000);
    expect(firstSearchResult).toMatch('Apple Inc.\n' + 'AAPL');
  });

  it('should display stock stats', () => {
    page.navigateToStockDetailPage('aapl');
    expect(page.getStockStatOpen()).toBeTruthy();
    expect(page.getStockStatHigh()).toBeTruthy();
    expect(page.getStockStatLow()).toBeTruthy();
    expect(page.getStockStatVol()).toBeTruthy();
    expect(page.getStockStatMktCap()).toBeTruthy();
    expect(page.getStockStat52weekHigh()).toBeTruthy();
    expect(page.getStockStat52weekLow()).toBeTruthy();
    expect(page.getStockStatAvgVol()).toBeTruthy();
    browser.sleep(5000);
  });
});