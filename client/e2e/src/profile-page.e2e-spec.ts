import { browser } from "protractor";
import { UserProfilePage } from "./profile-page.po";
import { UserAuthPage } from "./user-auth.po";
import { StockDetail } from "./stock-detail.po";

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
        page.navigateToProfilePage("SystemTestUser");
        expect(page.getTransactionsElement().isPresent()).toBeTruthy();
    });

    it('should be able to view basic profile information', () =>{
        page.navigateToProfilePage("SystemTestUser");
        expect(page.getProfileBio().isPresent()).toBeTruthy();
        expect(page.getProfileUsername().isPresent()).toBeTruthy();
        expect(page.getProfilePicture().isPresent()).toBeTruthy();
        expect(page.getProfileCoverPicture().isPresent()).toBeTruthy();
    })
});

describe('follower / followee tests', () =>{
    let page: UserProfilePage;
    let authentication: UserAuthPage;

    beforeEach(() => {
        page = new UserProfilePage();
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
        page.navigateToProfilePage("SystemTestPaul");
        const followButton = page.getFollowButton();
        followButton.click();
        page.navigateToProfilePage("SystemTestUser");
        browser.sleep(1000);
        expect(page.getFollowers1TextButton().isPresent()).toBeTruthy();
        browser.sleep(1000);
        //unfollow section
        page.navigateToProfilePage("SystemTestPaul");
        const unfollowButton = page.getUnfollowButton();
        unfollowButton.click();
        page.navigateToProfilePage("SystemTestUser");
        browser.sleep(1000);
        expect(page.getFollowers0TextButton().isPresent()).toBeTruthy();
        browser.sleep(1000);
    });

    it('should be able to view people you are following', () => {
        page.navigateToProfilePage("SystemTestPaul");
        const followButton = page.getFollowButton();
        followButton.click();
        page.navigateToProfilePage("SystemTestUser");
        browser.sleep(1000);
        const followersNumberButton = page.getFollowers1TextButton();
        followersNumberButton.click();
        expect(page.getDetailedFollowingList().isPresent()).toBeTruthy();
        browser.sleep(1000);
    })
})