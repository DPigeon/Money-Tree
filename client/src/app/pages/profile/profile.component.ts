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
  
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.storeFacade.loadCurrentProfileUser(username);
  }

}
