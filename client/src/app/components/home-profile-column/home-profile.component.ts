import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

export interface StockProfile {
  company: string;
  amount: number;
  gain_d: number;
  gain_p: number;
}
@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.scss'],
})
export class HomeProfileComponent implements OnInit {
  @Input() currentUser: User;
  followingSearch = '';
  displayedColumns: string[] = ['company', 'amount', 'gain_d', 'gain_p'];
  dataSource = [{ company: 'AC', amount: 0, gain_d: 0, gain_p: 0 }];

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {}

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
