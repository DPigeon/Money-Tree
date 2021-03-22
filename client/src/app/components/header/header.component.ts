import { Component, Input, OnInit } from '@angular/core';
import { UserSearch } from 'src/app/interfaces/userSearch';

import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() userPhotoURL: string;
  userSearch$ = this.storeFacade.userSearch$;
  showSearchBar = false;
  constructor(private storeFacade: StoreFacadeService) {}
  ngOnInit(): void {
    this.storeFacade.loadUserSearchList();

    this.userSearch$.subscribe((userList: UserSearch[]) => {
      // Loading search user list
      if (!!userList) {
        this.showSearchBar = true;
      } else {
        this.showSearchBar = false;
      }
    });
  }
  logout(): void {
    this.storeFacade.logCurrentUserOut();
  }
}
