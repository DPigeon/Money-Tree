import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserProfile } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { ListOfFollowsComponent } from 'src/app/components/list-of-follows/list-of-follows.component';

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
  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
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
  }
  openDialog(choice: string): void {
    let dialogRef;
    switch (choice) {
      case 'followers':
        dialogRef = this.dialog.open(ListOfFollowsComponent, {
          data: { followslist: this.getFollowers(), followsTitle: choice },
        });
        break;

      case 'followings':
        dialogRef = this.dialog.open(ListOfFollowsComponent, {
          data: { followslist: this.getFollowings(), followsTitle: choice },
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
    const label = this.followButtonLabel();
    if (label === 'Follow') {
      this.userService
        .followUser(this.loggedInUserId, this.completeUserProfile.id)
        .toPromise()
        .then(() => this.followersUpdate());
    } else if (label === 'Unfollow') {
      this.userService
        .unfollowUser(this.loggedInUserId, this.completeUserProfile.id)
        .toPromise()
        .then(() => this.followersUpdate());
    }
  }
  followersUpdate(): void {
    this.storeFacade.loadCurrentUserFollowings(this.loggedInUserId);
    this.storeFacade.loadCurrentProfileUser(this.completeUserProfile.username);
  }
}
