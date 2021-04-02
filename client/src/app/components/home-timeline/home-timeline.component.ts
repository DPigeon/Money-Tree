import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TimelineFeed } from 'src/app/interfaces/timelineFeed';
import { Stock } from '../../interfaces/stock';

@Component({
  selector: 'app-home-timeline',
  templateUrl: './home-timeline.component.html',
  styleUrls: ['./home-timeline.component.scss'],
})

export class HomeTimelineComponent implements OnChanges{
  @Input() timeline: TimelineFeed[] = [];
  feed:TimelineFeed[] =[]
  constructor(private router: Router) {}
  
ngOnChanges(): void {
  this.feed =this.timeline;
}
  navigateToadditionalProfile(entityId: string, type: string): void {
    if (type === 'followers' || type === 'investors') {
      // to be changed to profile page
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/stock-detail/' + entityId]);
    }
  }
}
