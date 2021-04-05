import { browser, by, element } from 'protractor';
import { HttpClient } from 'protractor-http-client';

const http = new HttpClient('http://localhost:8080/api/v1/');

const systemTestUser2 = {
  firstName: 'System',
  lastName: 'Test',
  username: 'SystemTestUser',
  avatarURL: '',
  coverPhotoURL: '',
  password: 'Hunter42',
  email: 'systemtestuser6@systemtestuser.com',
  score: 12,
  rank: 10000,
  balance: 223,
  alpacaApiKey: 'bc3b0e9a-30d4-4f99-9bcd-b324417eb428', // this is local to my only for my system test
  portfolio: [],
  transactions: [],
};

const userToFollow = {
  firstName: 'Paul',
  lastName: 'SystemTest',
  username: 'SystemTestPaul',
  avatarURL: '',
  coverPhotoURL: '',
  password: 'Hunter42',
  email: 'systemtestpaul@systemtestuser.com',
  score: 12,
  rank: 10000,
  balance: 223,
  alpacaApiKey: 'bc3b0e9a-30d4-4f99-9bcd-b324417eb428', // this is local to my only for my system test
  portfolio: [],
  transactions: [],
};

export class UserAuthPage {
  navigateHome(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  navigateToBasePage(): Promise<unknown>  {
    return browser.get(browser.baseUrl + "home") as Promise<unknown>;
  }

  navigateHomeWithAlpacaCode(): Promise<unknown> {
    return browser.get(
      browser.baseUrl + '?code=b64858d3-ee1f-4e70-922c-4da74e13ae46'
    ) as Promise<unknown>;
  }

  authenticateUser(): void {
    http.post('users/', systemTestUser2);
    this.navigateHome();
    const emailInput = element(by.id('login-email'));
    const passwordInput = element(by.id('login-password'));
    const loginBtn = element(by.id('login-submit-btn'));
    emailInput.sendKeys(systemTestUser2.email);
    passwordInput.sendKeys(systemTestUser2.password);
    loginBtn.click();
  }

  loginWithUserFromInitialPage(email: string, password: string): void {
    this.navigateHome();
    const emailInput = element(by.id('login-email'));
    const passwordInput = element(by.id('login-password'));
    const loginBtn = element(by.id('login-submit-btn'));
    emailInput.sendKeys(email);
    passwordInput.sendKeys(password);
    loginBtn.click();
  }

  createUserToFollowe(): void {
    http.post('users/', userToFollow);
  }

  cleanAuthenticatedUser(): void {
    http.delete('/users/delete-by-email/' + systemTestUser2.email);
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  }

  cleanUserToFollowe(): void {
    http.delete('/users/delete-by-email/' + userToFollow.email);
  }
}
