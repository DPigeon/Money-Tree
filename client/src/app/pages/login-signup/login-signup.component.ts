import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {
  hasAlpacaCode: boolean = false;
  hasAppError = this.storeFacade.appError$;

  constructor(private storeFacade: StoreFacadeService, private route: ActivatedRoute, private router: Router) {

    this.storeFacade.shouldAlpacaRedirect$.subscribe(shouldRedirect =>{
      if(shouldRedirect && !this.hasAlpacaCode) {
        this.registerWithAlpaca();
      }
    });

    this.storeFacade.isUserLoggedIn$.subscribe(isUserLoggedIn =>{
      if(isUserLoggedIn) {
        this.router.navigate(['/home']);
      }
    })

    this.route.queryParams.subscribe(params => {
      const alpacaCode = params['code'];
      this.hasAlpacaCode = false;
      if(!!alpacaCode) {
        this.hasAlpacaCode = true;
        const userParams: User = {id: Number(localStorage.getItem('userId')), alpacaApiKey: alpacaCode};
        this.storeFacade.updateUser(userParams);
      }
    });
  }

  ngOnInit(): void {
  }

  registerWithAlpaca() {
    // TODO: This values need to be hidden / updated
    const redirectUri = 'http://localhost:4200/'//EnvironmentVariables.ALPACA_REDIRECT_URL;
    const clientId = '198903d0d2f523a25e4dce65837bbf0d';//EnvironmentVariables.ALPACA_CLIENT_ID;
    const alpacaUrl = 'https://app.alpaca.markets/oauth/authorize?response_type=code&client_id='+clientId+'&redirect_uri='+redirectUri+'&scope=trading'
    window.location.href = alpacaUrl;
  }

  handleUserLogin(userCredentials: User) {
    this.storeFacade.userLogin(userCredentials);
  }
}
