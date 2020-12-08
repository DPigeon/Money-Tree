import { browser } from 'protractor';

export class UserAuthPage {
  navigateHome(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  navigateHomeWithAlpacaCode(): Promise<unknown> {
    return browser.get(
      browser.baseUrl + '?code=b64858d3-ee1f-4e70-922c-4da74e13ae46'
    ) as Promise<unknown>;
  }
}
