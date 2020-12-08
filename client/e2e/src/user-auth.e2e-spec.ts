import { browser, by, element, ExpectedConditions, logging } from 'protractor';
import { UserAuthPage } from './user-auth.po';
import { HttpClient } from 'protractor-http-client';

const http = new HttpClient('http://localhost:8080/api/v1/');

const user = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'systemTestUser1',
  email: 'systemTestUser1@moneytree.com',
  password: 'wGEjJQiG!L7zkb2',
};

describe('user authentication', () => {
  let page: UserAuthPage;
  const emailInput = element(by.id('login-email'));
  const passwordInput = element(by.id('login-password'));
  const loginBtn = element(by.id('login-submit-btn'));
  const logoutBtn = element(by.id('logout-btn'));
  // signup
  const signupFirstName = element(by.id('signup-first-name'));
  const signupLastName = element(by.id('signup-last-name'));
  const signupUsername = element(by.id('signup-username'));
  const signupEmail = element(by.id('signup-email'));
  const signupPassword = element(by.id('signup-password'));
  const signupPassword2 = element(by.id('signup-password-2'));
  const signupSubmitBtn = element(by.id('signup-submit-btn'));

  beforeEach(() => {
    page = new UserAuthPage();
  });

  afterAll(() => {
    http.delete('/users/delete-by-email/' + user.email);
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  it('should create the user account and navigate to alpaca', () => {
    page.navigateHome();
    signupFirstName.sendKeys(user.firstName);
    signupLastName.sendKeys(user.lastName);
    signupUsername.sendKeys(user.username);
    signupEmail.sendKeys(user.email);
    signupPassword.sendKeys(user.password);
    signupPassword2.sendKeys(user.password);
    signupSubmitBtn.click();
    browser.sleep(5000);
    expect(
      browser.wait(ExpectedConditions.urlContains('alpaca'), 5000).catch(() => {
        return false;
      })
    ).toBeTruthy(`Url match could not succced`);
  });

  it('should update user with alpaca id and navigate home', () => {
    page.navigateHomeWithAlpacaCode();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'home');
  });

  it('should navigate to signup page if the user logs out', () => {
    logoutBtn.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl);
  });

  it('should navigate to home if the user is logged in', () => {
    page.navigateHome();
    emailInput.sendKeys(user.email);
    passwordInput.sendKeys(user.password);
    loginBtn.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'home');
  });
});
