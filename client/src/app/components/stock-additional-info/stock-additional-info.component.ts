import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from '../../interfaces/stock';
export interface Follower {
  user: any;
  currentStockLoaded: Stock;
  errorMessage: any;
}
@Component({
  selector: 'app-stock-additional-info',
  templateUrl: './stock-additional-info.component.html',
  styleUrls: ['./stock-additional-info.component.scss'],
})
export class StockAdditionalInfoComponent {
  @Input() type: string;
  //list to be changed
  list: any = [
    { firstName: 'Marwan', lastName: 'Ayadi' },
    { firstName: 'Razine', lastName: 'Bensari' },
    { firstName: 'Arthur', lastName: 'Tourneyrie' },
    { firstName: 'Alessandro', lastName: 'Kreslin' },
    { firstName: 'David ', lastName: 'Pigeon' },
    { firstName: 'Abdulrahim', lastName: 'Mansour' },
    { firstName: 'Walter', lastName: 'Fleury' },
    { firstName: 'Hossein', lastName: 'Noor' },
    { firstName: 'Lindsay', lastName: 'Bangs' },
  ];

  constructor(private router: Router) {}

  navigateToadditionalProfile(entityId: string, type: string): void {
    if (type === 'followers' || type === 'investors') {
      // to be changed to prolipe page
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/stock-detail/' + entityId]);
    }
  }
  getTitleByType() {
    if (this.type === 'followers') {
      return 'Followers';
    } else if (this.type === 'investors') {
      return 'Top Investors';
    } else {
      return 'People who owns this stock also own these stocks';
    }
  }
  getIconByType() {
    if (this.type === 'followers') {
      return 'group_add';
    } else if (this.type === 'investors') {
      return 'trending_up';
    } else {
      return 'domain';
    }
  }
}
