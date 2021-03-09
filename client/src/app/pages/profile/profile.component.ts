import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userTransactions$ = this.storeFacade.userTransactions$;
  constructor(
    private storeFacade: StoreFacadeService
  ) { }
  ngOnInit(): void {
    this.userTransactions$ = this.storeFacade.userTransactions$;
    console.log('User Info in profile component', this.userTransactions$);
  }

}
