import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { User, UserProfile } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { ListOfFollowsComponent } from 'src/app/components/list-of-follows/list-of-follows.component';
import { filter } from 'rxjs/operators';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/interfaces/stock';

export interface ChartDataOptions {
  range: string;
  interval: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe],
})
export class ProfileComponent implements OnInit {
  loggedInUserId: number;
  currentProfileUser$ = this.storeFacade.currentProfileUser$;
  completeUserProfile: UserProfile;
  followers: User[];
  followings: User[];
  followButtonDisabled = false;
  profileHistoryChartData: StockHistory;
  userId = null;
  showPortfolioChart = false;
  userOwnedStocks$: Observable<Stock[]>;
  showProfileColumn = false;

  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get('username');
    this.storeFacade.loadCurrentProfileUser(username);
    this.currentProfileUser$.subscribe((data: UserProfile) => {
      if (data) {
        this.storeFacade.loadUserOwnedStocks(data.id);
        this.userOwnedStocks$ = this.storeFacade.userOwnedStocks$;
        this.completeUserProfile = data;
        this.userId = String(this.completeUserProfile.id);
        this.generateData(String(data.id), 'FIFTEEN_MINUTE', 1, 'DAY');
        this.showProfileColumn = true;
      }
    });
    this.storeFacade.currentUser$.subscribe((loggedInUser: User) => {
      if (loggedInUser) {
        this.loggedInUserId = loggedInUser.id;
      }
    });

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        username = this.route.snapshot.paramMap.get('username');
        this.storeFacade.loadCurrentProfileUser(username);
      });
  }
  openDialog(choice: string): void {
    let dialogRef;
    switch (choice) {
      case 'followers':
        dialogRef = this.dialog.open(ListOfFollowsComponent, {
          data: {
            followslist: this.getFollowers(),
            username: this.completeUserProfile.username,
            listType: 'followers',
          },
        });
        break;

      case 'followings':
        dialogRef = this.dialog.open(ListOfFollowsComponent, {
          data: {
            followslist: this.getFollowings(),
            username: this.completeUserProfile.username,
            listType: 'followings',
          },
        });
        break;
    }

    dialogRef.componentInstance.navigateToProfile.subscribe(
      (data: string[]) => {
        // data is [username, userId]
        // Angular would not reload the component if the base rout stays onchanged (/profile):
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router
          .navigate(['profile/' + data[0]])
          .then(dialogRef.close())
          .then(() => this.storeFacade.loadUserTransactions(Number(data[1])));
      }
    );
  }

  getFollowers(): User[] {
    return this.completeUserProfile ? this.completeUserProfile.followers : null;
  }
  getFollowings(): User[] {
    return this.completeUserProfile ? this.completeUserProfile.following : null;
  }
  isLoggedInUserProfile(): boolean {
    return this.completeUserProfile == null || this.loggedInUserId == null
      ? null
      : this.completeUserProfile.id === Number(this.loggedInUserId);
  }
  followButtonLabel(): string {
    let label = 'Follow';
    const profileUserFollowers = this.completeUserProfile.followers;
    for (const follower of profileUserFollowers) {
      if (follower.id === this.loggedInUserId) {
        label = 'Unfollow';
        break;
      }
    }
    return label;
  }
  followOrUnfollow(): void {
    this.followButtonDisabled = true;
    const label = this.followButtonLabel();
    if (label === 'Follow') {
      this.storeFacade.followUser(
        this.loggedInUserId,
        this.completeUserProfile.id
      );
      this.storeFacade.loadCurrentProfileUser(
        this.completeUserProfile.username
      );
    } else if (label === 'Unfollow') {
      this.storeFacade.unfollowUser(
        this.loggedInUserId,
        this.completeUserProfile.id
      );
    }
    this.completeProfileUserUpdate();
  }
  completeProfileUserUpdate(): void {
    setTimeout(() => {
      this.storeFacade.loadCurrentProfileUser(
        this.completeUserProfile.username
      );
      this.followButtonDisabled = false;
    }, 500);
  }
  bioText(): string {
    return this.completeUserProfile.biography
      ? this.completeUserProfile.biography
      : 'This user has no biography yet.';
  }

  changeChartRangeInterval(chartOptions: ChartDataOptions): void {
    if (this.userId) {
      let unit = '';
      let length = 0;
      let interval = '';
      switch (chartOptions.range) {
        case '1d':
          unit = 'DAY';
          length = 1;
          break;
        case '5d':
          unit = 'DAY';
          length = 5;
          break;
        case '1mo':
          unit = 'MONTH';
          length = 1;
          break;
        case '6mo':
          unit = 'MONTH';
          length = 6;
          break;
        case '1y':
          unit = 'YEAR';
          length = 1;
          break;
        case '5y':
          unit = 'YEAR';
          length = 5;
          break;
        default:
        case '5y':
          // to be changed in the futur
          unit = 'YEAR';
          length = 5;
          break;
      }
      switch (chartOptions.interval) {
        case '5m':
          interval = 'FIVE_MINUTE';
          break;
        case '15m':
          interval = 'FIFTEEN_MINUTE';
          break;
        case '1h':
          interval = 'ONE_DAY';
          break;
        case '1d':
          interval = 'ONE_DAY';
          break;
        default:
          interval = 'ONE_DAY';
      }
      this.generateData(this.userId, interval, length, unit);
    }
  }

  generateData(
    userId: string,
    interval: string,
    length: number,
    unit: string
  ): void {
    const currentDate = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');
    this.userService
      .getPortfolioHistoricalData(
        String(userId),
        length,
        unit,
        interval,
        currentDate,
        'false'
      )
      .subscribe(
        (res) => {
          if (res) {
            this.profileHistoryChartData = res;
            this.showPortfolioChart = true;
          }
        },
        (err) => {
          this.profileHistoryChartData = null;
          this.showPortfolioChart = false;
        }
      );
  }
}
