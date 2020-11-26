import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoreFacadeService } from './store/store-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private storeFacade: StoreFacadeService, private router: Router) {

    // This handles authentication logic / routing
    this.storeFacade.authenticationInformation$.subscribe(info =>{
      const localUserId = Number(localStorage.getItem('userId'));

      if(!info.userExists || !info.hasAlpacaCode) {
        // if the user exists with no alpaca code, or if no user exists and no id in local
        if((info.userExists && !info.hasAlpacaCode) || (!info.userExists && !localUserId)) {
          this.router.navigate(['/']);
        }

        // if no user exists but an id is stored, load the user with id
        if(!info.userExists && localUserId) {
          this.storeFacade.getCurrentUser(localUserId);
        }
      }
    })
  }
}
