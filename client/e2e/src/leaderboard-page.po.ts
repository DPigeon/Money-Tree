import { browser, by, element } from "protractor";

export class LeaderboardPage {

    navigateToLeaderboardPage() {
        return browser.get(browser.baseUrl + "leaderboard") as Promise<unknown>;
    }

    getFirstLeadboardElement(): Promise<string> {
        return element(by.className("user-rank")).getText() as Promise<string>;
    }
}