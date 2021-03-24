import { browser, by, element, ElementFinder } from "protractor";


export class UserProfilePage {
    navigateToProfilePage(username: string) {
        return browser.get(browser.baseUrl + "profile/" + username) as Promise<unknown>;
    }
    getTransactionsElement(): ElementFinder {
        return element(by.className("single-transaction-container"));
    }
    getFollowButton(): ElementFinder {
        return element(by.buttonText("Follow"));
    }
    getUnfollowButton(): ElementFinder {
        return element(by.buttonText("Unfollow")); 
    }
    getFollowers1TextButton(): ElementFinder {
        return element(by.buttonText("1 followings"));
    }
    getFollowers0TextButton(): ElementFinder {
        return element(by.buttonText("0 followings"));
    }
    getDetailedFollowingList(): ElementFinder {
        return element(by.className("user-container"));
    }
    getProfileBio(): ElementFinder {
        return element(by.className("bio"));
    }
    getProfileUsername(): ElementFinder {
        return element(by.className("username"));
    }
    getProfilePicture(): ElementFinder {
        return element(by.className("profile-picture"));
    }
    getProfileCoverPicture(): ElementFinder {
        return element(by.className("cover-picture"));
    }
}