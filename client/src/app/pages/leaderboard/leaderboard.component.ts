import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  // , AfterContentInit {
  topUsers: User[] = null;

  constructor(
    private storeFacade: StoreFacadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeFacade.loadLeaderboardUsers();
    this.storeFacade.leaderboardUsers$.subscribe((data: User[]) => {
      if (data) {
        this.topUsers = data;
      }
    });
  }
  navigateToProfile(username: string): void {
    this.router.navigate(['profile/' + username]);
  }
}
