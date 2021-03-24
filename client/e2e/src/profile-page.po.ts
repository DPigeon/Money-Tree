import { browser, by, element } from "protractor";


export class UserProfilePage {
    navigateToProfilePage(username: string) {
        return browser.get(browser.baseUrl + "profile/" + username) as Promise<unknown>;
    }
    getTransactionsElement() {
        return element(by.className("single-transaction-container"));
    }
}