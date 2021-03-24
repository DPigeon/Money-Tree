import { browser } from "protractor";
import { LeaderboardPage } from './leaderboard-page.po';
import { UserAuthPage } from "./user-auth.po";

describe('leaderboard page system tests', () => {
    let page: LeaderboardPage;
    let authentication: UserAuthPage;

    beforeEach(() => {
        page = new LeaderboardPage();
        authentication = new UserAuthPage();
        authentication.authenticateUser();
        browser.sleep(1000);
    });

    afterEach(() => {
        authentication.cleanAuthenticatedUser();
        browser.sleep(1000);
    });

    it('should be able to view leaderboard', () => {
        page.navigateToLeaderboardPage();
        expect(page.getFirstLeadboardElement()).toBeTruthy();
    })
});