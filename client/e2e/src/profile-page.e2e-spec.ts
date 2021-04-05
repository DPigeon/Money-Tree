import { browser } from 'protractor';
import { UserProfilePage } from './profile-page.po';
import { UserAuthPage } from './user-auth.po';
import { StockDetail } from './stock-detail.po';

describe('profile page system tests', () => {
  let page: UserProfilePage;
  let authentication: UserAuthPage;
  let stockDetail: StockDetail;

  beforeEach(() => {
    page = new UserProfilePage();
    authentication = new UserAuthPage();
    stockDetail = new StockDetail();
    authentication.authenticateUser();
    browser.sleep(1000);
  });

  afterEach(() => {
    authentication.cleanAuthenticatedUser();
    browser.sleep(1000);
  });

  it('should be able to view user transactions', () => {
    stockDetail.placeMarketOrder();
    page.navigateToProfilePage('SystemTestUser');
    expect(page.getTransactionsElement().isPresent()).toBeTruthy();
  });

  it('should be able to view basic profile information', () => {
    page.navigateToProfilePage('SystemTestUser');
    expect(page.getProfileBio().isPresent()).toBeTruthy();
    expect(page.getProfileUsername().isPresent()).toBeTruthy();
    expect(page.getProfilePicture().isPresent()).toBeTruthy();
    expect(page.getProfileCoverPicture().isPresent()).toBeTruthy();
  });

  it('should be able to edit a user profile', () => {
    const updatedBioText = 'This is a test bio for the system';
    authentication.navigateToBasePage();
    const editProfileBtn = page.getEditUserButton();
    editProfileBtn.click();
    const bioInput = page.getEditProfileBio();
    bioInput.sendKeys(updatedBioText);
    browser.sleep(1000);
    const editProfileSaveChangesBtn = page.getEditProfileSaveChanges();
    editProfileSaveChangesBtn.click();
    page.navigateToProfilePage('SystemTestUser');
    const profileBio = page.getProfileBio();
    expect(profileBio.getText()).toBe(updatedBioText);
    browser.sleep(1000);
  });

  it('should be able to search for a username', () => {
    const searchbar = stockDetail.getStockSearchBar();
    searchbar.sendKeys('SystemTestUser');
    const firstSearchResult = stockDetail.getFirstSearchResult();
    browser.sleep(2000);
    expect(firstSearchResult).toMatch('System Test\n' + 'SystemTestUser');
  });

  it('should be able to view portfolio value over time', () => {
    page.navigateToProfilePage('SystemTestUser');
    const chart = page.getPorfolioChart();
    expect(chart.isPresent()).toBeTruthy();
  });
});

describe('follower / followee tests', () => {
  let page: UserProfilePage;
  let authentication: UserAuthPage;
  let stockDetail: StockDetail;

  beforeEach(() => {
    page = new UserProfilePage();
    stockDetail = new StockDetail();
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

  it('should be able to follow / unfollower another user', () => {
    page.navigateToProfilePage('SystemTestPaul');
    const followButton = page.getFollowButton();
    followButton.click();
    page.navigateToProfilePage('SystemTestUser');
    browser.sleep(1000);
    expect(page.getFollowers1TextButton().isPresent()).toBeTruthy();
    browser.sleep(1000);
    // unfollow section
    page.navigateToProfilePage('SystemTestPaul');
    const unfollowButton = page.getUnfollowButton();
    unfollowButton.click();
    page.navigateToProfilePage('SystemTestUser');
    browser.sleep(1000);
    expect(page.getFollowers0TextButton().isPresent()).toBeTruthy();
    browser.sleep(1000);
  });

  it('should be able to view people you are following', () => {
    page.navigateToProfilePage('SystemTestPaul');
    const followButton = page.getFollowButton();
    followButton.click();
    page.navigateToProfilePage('SystemTestUser');
    browser.sleep(1000);
    const followersNumberButton = page.getFollowers1TextButton();
    followersNumberButton.click();
    expect(page.getDetailedFollowingList().isPresent()).toBeTruthy();
    browser.sleep(1000);
  });

  it('should be able to view timeline', () => {
    stockDetail.placeMarketOrder();
    // logout
    const logoutBtn = page.getLogoutBtn();
    logoutBtn.click();
    browser.sleep(1000);
    // login as other other
    authentication.loginWithUserFromInitialPage(
      'systemtestpaul@systemtestuser.com',
      'Hunter42'
    );
    // follow the user that made the transaction
    browser.sleep(1000);
    page.navigateToProfilePage('SystemTestUser');
    const followButton = page.getFollowButton();
    followButton.click();
    authentication.navigateToBasePage();
    const feedElement = page.getTimelineFeedElement();
    expect(feedElement.isPresent()).toBeTruthy();
  });
});
