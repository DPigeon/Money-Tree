import { browser } from 'protractor';
import { UserAuthPage } from './user-auth.po';
import { StockDetail } from './stock-detail.po';
import { UserProfilePage } from './profile-page.po';

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
  it('should show open market or closed market chip', () => {
    page.navigateToStockDetailPage('aapl').then(() => {
      if (page.getClosedMarketChip().isPresent()) {
        expect(page.getOpenMarketChip().isPresent()).toBeFalsy();
        expect(page.getMarketNextOpenMsg().isPresent()).toBeTruthy();
      } else if (page.getOpenMarketChip().isPresent()) {
        expect(page.getClosedMarketChip().isPresent()).toBeFalsy();
        expect(page.getMarketNextOpenMsg().isPresent()).toBeFalsy();
      }
    });
    browser.sleep(5000);
  });
  it('should show stock historical chart', () => {
    page.navigateToStockDetailPage('aapl').then(() => {
      if (page.getStockChart().isPresent()) {
        expect(page.getStockUnavailableChart().isPresent()).toBeFalsy();
        expect(page.getChartOptions().isPresent()).toBeTruthy();
      } else if (page.getStockUnavailableChart().isPresent()) {
        expect(page.getStockChart().isPresent()).toBeFalsy();
        expect(page.getChartOptions().isPresent()).toBeTruthy();
      }
    });
    browser.sleep(5000);
  });

  // TO BE TESTED WHEN THE STOCK MARKET IS OPEN
  it('should place a market buy order', () => {
    browser.sleep(2000);
    page.placeMarketOrder();
    expect(page.getStockConfirmationSnackBar().isPresent()).toBeTruthy();
  });

  // TO BE TESTED WHEN THE STOCK MARKET IS OPEN
  it('should place a market sell order', () => {
    page.placeMarketOrder();
    browser.sleep(1000);
    const sellStockButton = page.getStockStockSellButton();
    sellStockButton.click();
    browser.sleep(1000);
    const quantityInput = page.getStockQuantityInput();
    quantityInput.sendKeys(1);
    const sellActionButton = page.getPopupStockActionButton();
    sellActionButton.click();
    expect(page.getStockConfirmationSnackBar().isPresent()).toBeTruthy();
  });

  it('should place a limit buy order', () => {
    page.navigateToStockDetailPage('bb');
    const buyButton = page.getStockStockBuyButton();
    buyButton.click();
    browser.sleep(1000);
    const limitRadioButton = page.getStockLimitRadioButton();
    limitRadioButton.click();
    const quantityInput = page.getStockQuantityInput();
    quantityInput.sendKeys(1);
    const priceInput = page.getLimitPriceInput();
    priceInput.sendKeys(1);
    const popupBuyButton = page.getPopupStockActionButton();
    browser.sleep(1000);
    popupBuyButton.click();
    expect(page.getStockConfirmationSnackBar().isPresent()).toBeTruthy();
  });

  it('should place a limit sell order', () => {
    page.placeMarketOrder();
    browser.sleep(1000);
    const sellStockButton = page.getStockStockSellButton();
    sellStockButton.click();
    browser.sleep(1000);
    const limitRadioButton = page.getStockLimitRadioButton();
    limitRadioButton.click();
    const quantityInput = page.getStockQuantityInput();
    quantityInput.sendKeys(1);
    const priceInput = page.getLimitPriceInput();
    priceInput.sendKeys(1);
    const sellActionButton = page.getPopupStockActionButton();
    sellActionButton.click();
    expect(page.getStockConfirmationSnackBar().isPresent()).toBeTruthy();
  });

  it('should be able to view user stock ownings', () => {
    page.placeMarketOrder();
    browser.sleep(2000);
    authentication.navigateToBasePage();
    browser.sleep(3000);
    expect(page.getStockSymbolHomePage().getText()).toBe('BB');
  });

  it('should update a users score after selling a stock', () => {
    page.placeMarketOrder();
    browser.sleep(1000);
    const sellStockButton = page.getStockStockSellButton();
    sellStockButton.click();
    browser.sleep(1000);
    const quantityInput = page.getStockQuantityInput();
    quantityInput.sendKeys(1);
    const sellActionButton = page.getPopupStockActionButton();
    sellActionButton.click();
    expect(page.getStockConfirmationSnackBar().isPresent()).toBeTruthy();
    authentication.navigateToBasePage();
    browser.sleep(3000);
    const score = page.getUserScore();
    expect(score.getText()).not.toBe('0');
  });
});

describe('Social Stock Tests', () => {
  let page: StockDetail;
  let authentication: UserAuthPage;
  let userProfile: UserProfilePage;

  beforeEach(() => {
    userProfile = new UserProfilePage();
    page = new StockDetail();
    authentication = new UserAuthPage();
    authentication.authenticateUser();
    authentication.createUserToFollowe();
    browser.sleep(1000);
  });

  afterEach(() => {
    authentication.cleanAuthenticatedUser();
    authentication.cleanUserToFollowe();
    browser.sleep(1000);
  });

  it('should diplay list of top investors in stock', () => {
    page.placeMarketOrder();
    const logoutBtn = userProfile.getLogoutBtn();
    logoutBtn.click();
    authentication.loginWithUserFromInitialPage(
      'systemtestpaul@systemtestuser.com',
      'Hunter42'
    );
    browser.sleep(1000);
    page.navigateToStockDetailPage('BB');
    const topInvestorBlock = page.getAdditionalInfomation();
    expect(topInvestorBlock.isPresent()).toBeTruthy();
  });

  it('should display list of stocks others own', () => {
    page.placeMarketOrder();
    page.placeMarketOrder('aapl');
    const logoutBtn = userProfile.getLogoutBtn();
    logoutBtn.click();
    authentication.loginWithUserFromInitialPage(
      'systemtestpaul@systemtestuser.com',
      'Hunter42'
    );
    browser.sleep(1000);
    // follow user
    userProfile.navigateToProfilePage('SystemTestUser');
    browser.sleep(1000);
    const followButton = userProfile.getFollowButton();
    followButton.click();
    browser.sleep(1000);
    page.navigateToStockDetailPage('bb');
    browser.sleep(2000);
    const getAdditionalInformation = page.getAdditionalInfomation();
    expect(getAdditionalInformation.isPresent()).toBeTruthy();
  });
});
