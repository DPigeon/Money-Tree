import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentProfileUser$ = this.storeFacade.currentProfileUser$;
  //userTransactions$ = this.storeFacade.userTransactions$; // load currentProfileUser 
  //currentUser$ = this.storeFacade.currentUser$
  
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    
    //check if current user == route params
    // 
    const username = this.route.snapshot.paramMap.get('username');
    console.log("THIS IS USERNAME");
    console.log(username);

    // if (username == this.currentUser$)
    this.storeFacade.loadCurrentProfileUser(username);
    //this.userTransactions$ = this.storeFacade.userTransactions$;
    //console.log('User Info in profile component', this.userTransactions$);

    // subscription is no the best idea here
    // forget being optimized if we look for the current user, we will re-load their data anyways



  }

}
