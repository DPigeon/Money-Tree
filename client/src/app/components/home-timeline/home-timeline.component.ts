import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TimelineFeed } from 'src/app/interfaces/timelineFeed';

@Component({
  selector: 'app-home-timeline',
  templateUrl: './home-timeline.component.html',
  styleUrls: ['./home-timeline.component.scss'],
})
export class HomeTimelineComponent implements OnChanges {
  @Input() timeline: TimelineFeed[] = [];
  feed: TimelineFeed[] = [];
  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.feed = this.timeline;
  }
  navigateTo(type: string, id: string): void {
    const route = (type === 'user' ? '/profile/' : '/stock-detail/') + id;
    this.router.navigate([route]);
  }
  getFeedLine(type: string, qty: number, avgPrice: number): string[] {
    const action = type.includes('BUY') ? 'Bought' : ' Sold';
    const line1 = action + ' ' + qty + ' shares of';
    const line2 = ' stocks at an average of $' + avgPrice + ' a share.';
    return [line1, line2];
  }

  getFeedTime(time: string): any {
    let timeToDisplay = '';
    const currentDate = new Date();
    const feedDate = new Date(time);

    const diff = currentDate.getTime() - feedDate.getTime();

    const mins = Math.round(diff / (60 * 1000));
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (mins < 60) {
      timeToDisplay = mins + 'm';
    } else {
      const hours = Math.round(diff / (3600 * 1000));
      if (hours < 24) {
        timeToDisplay = hours + 'h';
      } else {
        timeToDisplay =
          months[feedDate.getMonth()] +
          ' ' +
          feedDate.getDate() +
          ', ' +
          feedDate.getFullYear();
      }
    }

    return timeToDisplay;
  }
}
