import { Component, Input } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userPhotoURL: string;
  constructor(private storeFacade: StoreFacadeService) {}

  logout(): void {
    this.storeFacade.logCurrentUserOut();
  }
}
