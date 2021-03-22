import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  topUsers: User[] = null;

  constructor(private storeFacade: StoreFacadeService, private router: Router) {
    this.topUsers = null;
  }

  ngOnInit(): void {
    this.topUsers = [
      {
        avatarURL:
          'https://moneytree-profile-pictures.s3.amazonaws.com/O2QRBBGXGO6HPZ4NE-user1.jfif',
        firstName: 'Amanda',
        lastName: 'Lee',
        rank: 1,
        score: 486,
      },
      {
        avatarURL:
          'https://moneytree-profile-pictures.s3.amazonaws.com/O2QRBBGXGO6HPZ4NE-user1.jfif',
        firstName: 'Mona',
        lastName: 'Hughes',
        rank: 2,
        score: 303,
      },
      {
        avatarURL:
          'https://moneytree-profile-pictures.s3.amazonaws.com/O2QRBBGXGO6HPZ4NE-user1.jfif',
        firstName: 'Trisha',
        lastName: 'Benign',
        rank: 3,
        score: 296,
      },
      {
        avatarURL:
          'https://moneytree-profile-pictures.s3.amazonaws.com/O2QRBBGXGO6HPZ4NE-user1.jfif',
        firstName: 'Christina',
        lastName: 'Sisto',
        rank: 4,
        score: 268,
      },
      {
        avatarURL:
          'https://moneytree-profile-pictures.s3.amazonaws.com/O2QRBBGXGO6HPZ4NE-user1.jfif',
        firstName: 'Chris',
        lastName: 'Flores',
        rank: 5,
        score: 186,
      },
    ];
    // this.storeFacade.leaderBoardUsers$
    //   .subscribe((data: User[]) => {
    //     if (data){
    //       this.topUsers = data;
    //     }
    //   }
  }
}
