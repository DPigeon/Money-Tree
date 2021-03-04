import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { Transaction } from 'src/app/interfaces/transaction';
import { Stock } from 'src/app/interfaces/stock';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() userPhotoURL: string;
  @Output() coverPhotoURL: string;

  currentUser$: Observable<User>;
  currentUser: User;
  followings$: Observable<User[]>;
  followers$: Observable<User[]>;
  userTransactions$: Observable<Transaction[]>;
  userOwnedStocks$: Observable<Stock[]>;

  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {
    this.currentUser = null; // otherwise there would be an undefined error because of waiting for the currentUser values to fetch
  }

  ngOnInit(): void {
    this.currentUser$ = this.storeFacade.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        this.userPhotoURL = this.currentUser.avatarURL;
        this.coverPhotoURL = this.currentUser.coverPhotoURL;

        // Loading followings and followers list and adding them to state
        this.storeFacade.loadCurrentUserFollowings(this.currentUser.id);
        this.storeFacade.loadCurrentUserFollowers(this.currentUser.id);
        this.storeFacade.loadUserTransactions(this.currentUser.id);
        this.storeFacade.loadUserOwnedStocks(this.currentUser.id);

        this.followings$ = this.storeFacade.currentFollowings$;
        this.followers$ = this.storeFacade.currentFollowers$; // can be sent to any other component (as component's input) in future commits
        this.userTransactions$ = this.storeFacade.userTransactions$;
        this.userOwnedStocks$ = this.storeFacade.userOwnedStocks$;
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: this.currentUser,
    });

    dialogRef.componentInstance.userPhotoUpdate.subscribe((imageFile: File) => {
      this.storeFacade.updatePictureURL(
        this.currentUser.id,
        imageFile,
        'avatarURL'
      );
    });

    dialogRef.componentInstance.userCoverPhotoUpdate.subscribe(
      (imageFile: File) => {
        this.storeFacade.updatePictureURL(
          this.currentUser.id,
          imageFile,
          'coverPhotoURL'
        );
      }
    );

    dialogRef.componentInstance.userUpdate.subscribe(
      (updatedUserInfo: User) => {
        this.storeFacade.updateUser(updatedUserInfo);
      }
    );
  }
}
