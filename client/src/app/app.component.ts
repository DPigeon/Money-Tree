import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreFacadeService } from './store/store-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private storeFacade: StoreFacadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // This handles authentication logic / routing
    this.storeFacade.authenticationInformation$.subscribe((info) => {
      const localUserId = Number(localStorage.getItem('userId'));
      this.landingPageNavigator(
        info.userExists,
        info.hasAlpacaCode,
        localUserId
      );
    });
  }

  landingPageNavigator(
    userExists: boolean,
    hasAlpacaCode: boolean,
    localUserId: number
  ): void {
    if (!userExists || !hasAlpacaCode) {
      // if the user exists with no alpaca code, or if no user exists and no id in local
      if ((userExists && !hasAlpacaCode) || (!userExists && !localUserId)) {
        this.router.navigate(['/']);
      }

      // if no user exists but an id is stored, load the user with id
      if (!userExists && localUserId) {
        this.storeFacade.getCurrentUser(localUserId);
      }
    }
  }
}
