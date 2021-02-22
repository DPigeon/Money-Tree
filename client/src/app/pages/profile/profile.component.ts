import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userInfo$ = this.storeFacade.currentUser$;
  constructor(
    private storeFacade: StoreFacadeService
  ) { }
  ngOnInit(): void {
    this.userInfo$ = this.storeFacade.currentUser$;
    console.log('Lick my pussy and my crack', this.userInfo$);
  }

}
