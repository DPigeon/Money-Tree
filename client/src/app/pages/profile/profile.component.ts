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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loggedInUserId: number;
  currentProfileUser$ = this.storeFacade.currentProfileUser$;
  completeUserProfile: UserProfile;
  followers: User[];
  followings: User[];
  followButtonDisabled = false;
  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get('username');
    this.storeFacade.loadCurrentProfileUser(username);
    this.currentProfileUser$.subscribe((data: UserProfile) => {
      if (data) {
        this.completeUserProfile = data;
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
}
