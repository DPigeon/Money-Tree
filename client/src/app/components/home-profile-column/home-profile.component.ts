import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from 'src/app/store/store-facade.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { Observable } from 'rxjs';

export interface EarningsInfo {
  earnings: number;
  positive: boolean;
  balance?: number;
  percentage?: number;
  gain?: number;
  cost?: number;
}
@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.scss'],
})
export class HomeProfileComponent implements OnInit, OnChanges {
  @Input() currentUser: User;
  @Input() userOwnedStocks: Stock[];
  @Input() alpacaPositions$: Observable<AlpacaUserPosition[]>;
  alpacaPositions: any = null;
  followingSearch = '';
  user: User;
  userOwnedStockDetails: Stock[] = [];
  earningsInfo: EarningsInfo = {
    balance: 100000, // initialing the balance
    gain: 0,
    cost: 0,
    percentage: 0,
    earnings: 0,
    positive: true,
  };

  constructor(
    private router: Router,
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.alpacaPositions$.subscribe((data) => {
      this.alpacaPositions = data;
      this.generateEarningsInfo();
    });
  }

  ngOnChanges(): void {
    this.user = this.currentUser;
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
  generateEarningsInfo(): void {
    if (this.alpacaPositions) {
      this.earningsInfo.balance = this.user && this.user.balance ? this.user.balance : 100000;
      for (const position of this.alpacaPositions) {
        this.earningsInfo.balance += Number(position.cost);
        this.earningsInfo.gain += Number(position.gainAmount);
        this.earningsInfo.cost += Number(position.cost);
      }
      this.earningsInfo.balance = Number(this.earningsInfo.balance.toFixed(2));
      this.earningsInfo.gain = Number(this.earningsInfo.gain.toFixed(2));
      this.earningsInfo.percentage = Number(
        ((this.earningsInfo.gain / this.earningsInfo.cost) * 100).toFixed(2)
      );
      this.earningsInfo.positive = this.earningsInfo.gain > 0;
    }
  }

  getEarningsClass(positive: boolean): string {
    return positive ? 'positive-change' : 'negative-change';
  }
  getEarningSign(positive: boolean): string {
    return positive ? '+' : ''; // because for a negative number the - sign is already there
  }
  getEarningPercentge(earningsInfoPercentage): any {
    return !isNaN(earningsInfoPercentage) ? earningsInfoPercentage : '0.0';
  }
}
