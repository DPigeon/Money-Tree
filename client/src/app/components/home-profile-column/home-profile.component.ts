import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

export interface EarningsInfo {
  earnings: number;
  totalGain: number;
  positive: boolean;
  amount?: string;
  percentage?: string;
  gain?: string;
}
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
  earningsInfo: EarningsInfo = {
    amount: '0',
    gain: '0',
    percentage: '0',
    earnings: 0,
    totalGain: 0,
    positive: true,
  };

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.user = this.currentUser;
    this.userOwnedStockDetails = this.userOwnedStocks;
  }

  goToProfile(username: string): void {
    this.router
      .navigate(['/profile/' + username])
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
  setEarningsInfo(e: EarningsInfo): void {
    this.earningsInfo.amount = e.earnings.toFixed(2);
    this.earningsInfo.gain = e.totalGain.toFixed(2);
    this.earningsInfo.percentage = (
      e.totalGain /
      (e.earnings - e.totalGain)
    ).toFixed(2);
    e.positive = e.totalGain >= 0;
    this.earningsInfo.positive = e.positive;
  }

  getEarningsClass(positive: boolean): string {
    return positive ? 'positive-change' : 'negative-change';
  }
  getEarningSign(positive: boolean): string {
    return positive ? '+' : ''; // because for a negative number the - sign is already there
  }
  getEarningPercentge(earningsInfoPercentage){
    return !isNaN(earningsInfoPercentage) ? earningsInfoPercentage : "0.0";
  }
}
