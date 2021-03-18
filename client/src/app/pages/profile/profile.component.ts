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
  currentProfileUser$ = this.storeFacade.currentProfileUser$;
  completeUserProfile: UserProfile;
  followers: User[];
  followings: User[];
  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.storeFacade.loadCurrentProfileUser(username);
    this.currentProfileUser$.subscribe((data: UserProfile) => {
      if (data) {
        this.completeUserProfile = data;
      }
    });
  }
  openDialog(choice: string): void {
    let dialogRef;
    switch (choice) {
      case 'Followers':
        dialogRef = this.dialog.open(ListOfFollowsComponent, {
          data: { followslist: this.getFollowers(), followsTitle: choice },
        });
        break;

      case 'Followings':
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
}
