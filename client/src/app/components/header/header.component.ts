import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // encapsulation: ViewEncapsulation.None, // disable ViewEncapsulation to be able to show menu in mobile version
})
export class HeaderComponent implements OnInit {
  isInMobileMode: boolean;
  constructor() {}

  ngOnInit(): void {
    const isMobile = (window.innerWidth <= 600 );
    this.isInMobileMode = isMobile;
  }

}
