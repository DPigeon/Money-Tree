import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private storeFacade: StoreFacadeService) {}

  ngOnInit(): void {}

  logout() {
    this.storeFacade.logCurrentUserOut();
  }
}
