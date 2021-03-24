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
    })
});