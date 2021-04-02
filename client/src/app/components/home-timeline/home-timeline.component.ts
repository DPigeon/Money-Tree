import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from '../../interfaces/stock';

export interface Follower {
  user: any;
  currentStockLoaded: Stock;
  errorMessage: any;
}
@Component({
  selector: 'app-home-timeline',
  templateUrl: './home-timeline.component.html',
  styleUrls: ['./home-timeline.component.scss'],
})
export class HomeTimelineComponent {
  @Input() type: string;
  

  constructor(private router: Router) {}
  

  navigateToadditionalProfile(entityId: string, type: string): void {
    if (type === 'followers' || type === 'investors') {
      // to be changed to prolipe page
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/stock-detail/' + entityId]);
    }
  }
}
