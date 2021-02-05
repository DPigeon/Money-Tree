import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  hasAlpacaCode = false;
  appError = this.storeFacade.appError$;

  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeFacade.shouldAlpacaRedirect$.subscribe(
      (shouldRedirect: boolean) => {
        this.handleAlpacaRedirectResponse(shouldRedirect);
      }
    );

    this.storeFacade.isUserLoggedIn$.subscribe((isUserLoggedIn: boolean) => {
      this.handleLoginRedirect(isUserLoggedIn);
    });

    this.route.queryParams.subscribe((routeData) => {
      this.handleRouteData(routeData);
    });
  }

  handleAlpacaRedirectResponse(shouldRedirect: boolean): void {
    if (shouldRedirect && !this.hasAlpacaCode) {
      this.registerWithAlpaca();
    }
  }

  handleLoginRedirect(isUserLoggedIn: boolean): void {
    if (isUserLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  handleRouteData(routeData): void {
    const alpacaCode = routeData ? routeData.code : null;
    this.hasAlpacaCode = false;
    if (!!alpacaCode) {
      this.hasAlpacaCode = true;
      this.storeFacade.getAlpacaOAuthToken(Number(localStorage.getItem('userId')), alpacaCode);
    }
  }

  registerWithAlpaca(): void {
    const redirectUri = environment.alpacaRedirectURL;
    const clientId = '198903d0d2f523a25e4dce65837bbf0d';
    const alpacaUrl =
      'https://app.alpaca.markets/oauth/authorize?response_type=code&client_id=' +
      clientId +
      '&redirect_uri=' +
      redirectUri +
      '&scope=account:write%20trading';
    window.location.href = alpacaUrl;
  }

  handleUserLogin(userCredentials: User): void {
    this.storeFacade.userLogin(userCredentials);
  }
  handleUserSignup(newUser: User): void {
    this.storeFacade.createNewUser(newUser);
  }
}
