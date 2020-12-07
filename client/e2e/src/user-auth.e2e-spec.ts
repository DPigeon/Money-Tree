import { browser, by, element, logging } from 'protractor';
import { AppPage } from './app.po';

describe('user authentication', () => {
    let page: AppPage;
    let emailInput = element(by.id('login-email'));
    let passwordInput = element(by.id('login-password'));
    let loginBtn = element(by.id('login-submit-btn'));
    let logoutBtn = element(by.id('logout-btn'));
    // signup
    let signupFirstName = element(by.id('signup-first-name'));
    let signupLastName = element(by.id('signup-last-name'));
    let signupUsername = element(by.id('signup-username'));
    let signupEmail = element(by.id('signup-email'));
    let signupPassword = element(by.id('signup-password'));
    let signupPassword2 = element(by.id('signup-password-2'));
    let signupSubmitBtn = element(by.id('signup-submit-btn'));
    //alpaca btns

    //<a href="/login" class="_ff33b53d">Log In</a>
    //let alpacaLoginBtn = element(by.tagName("a[href='/login']"))
    let alpacaLoginBtn = browser.driver.findElement(by.tagName("a[href='/login']"));//element(by.tagName("a[href='/login']"))
    //<input name="username" type="email" autocapitalize="none" id="username" data-__meta="[object Object]" data-__field="[object Object]" class="ant-input" value="">
    let alpacaEmail = browser.driver.findElement(by.tagName("input[type='email']"));
    //<input name="password" type="password" autocorrect="off" id="password" data-__meta="[object Object]" data-__field="[object Object]" class="ant-input">
    let alpacaPassword = browser.driver.findElement(by.tagName("input[type='password']"));
    //<button type="submit" class="ant-btn login-button ant-btn-primary"><span>Login</span></button>
    let alpacaSubmitBtn = browser.driver.findElement(by.className("login-button"));
    //<button type="button" class="ant-btn ant-btn-primary" style="width: 168px; height: 43px; font-size: 16px; font-family: Gilroy-SemiBold;"><span>Allow</span></button> 
    let alpacaAllowBtn = browser.driver.findElement(by.className("ant-btn-primary"));

    beforeEach(() => {
      page = new AppPage();
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    it('should create the user account and navigate to home', () => {
        // page.navigateHome();
        browser.get(browser.baseUrl); 
        signupFirstName.sendKeys('John');
        signupLastName.sendKeys('Doe');
        signupUsername.sendKeys('JohnDoe1234567Test');
        signupEmail.sendKeys('JohnDoe1234567Test@JohnDoe12345Test.com');
        signupPassword.sendKeys('wGEjJQiG!L7zkb2');
        signupPassword2.sendKeys('wGEjJQiG!L7zkb2');
        signupSubmitBtn.click();
        //alpaca here
        alpacaLoginBtn.click();
        alpacaEmail.sendKeys('hn.84@yahoo.com');
        alpacaPassword.sendKeys();
        alpacaSubmitBtn.click();
        alpacaAllowBtn.click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:4200/home');
    })

    it('should navigate to home if the user is logged in', () => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        page.navigateHome();        
        emailInput.sendKeys('lolma@gmail.com');
        passwordInput.sendKeys('wGEjJQiG!L7zkb2');
        loginBtn.click();        
        expect(browser.getCurrentUrl()).toBe('http://localhost:4300/home');
    })

    it('should navigate to signup page if the user logs out', () => {
        logoutBtn.click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:4300/');
    })
});