import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.scss'],
})
export class HomeProfileComponent implements OnChanges {
  @Input() currentUser: User;
  @Input() userOwnedStocks: Stock[];
  followingSearch = '';
  user: User;
  userOwnedStockDetails: Stock[] = [];

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.user = this.currentUser;
    this.userOwnedStockDetails = this.userOwnedStocks;
  }

  goToProfile(): void {
    this.router
      .navigate(['/profile/' + this.currentUser.username])
      .then(() => this.storeFacade.loadUserTransactions(this.currentUser.id));
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
