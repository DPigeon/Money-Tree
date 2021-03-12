import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentProfileUser$ = this.storeFacade.currentProfileUser$;
  userTransactions$ = this.storeFacade.userTransactions$; // load currentProfileUser 
  currentUser$ = this.storeFacade.currentUser$
  
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    
    //check if current user == route params
    // 
    let username = this.route.snapshot.paramMap.get('username');
    // if (username == this.currentUser$)
    this.storeFacade.loadCurrentProfileUser(username);
    this.userTransactions$ = this.storeFacade.userTransactions$;
    console.log('User Info in profile component', this.userTransactions$);
  }

}
