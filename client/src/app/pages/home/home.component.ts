import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { Transaction } from 'src/app/interfaces/transaction';
import { Stock } from 'src/app/interfaces/stock';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { TimelineFeed } from 'src/app/interfaces/timelineFeed';

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
  alpacaPositions$: Observable<AlpacaUserPosition[]>;
  timelineFeed: Observable<TimelineFeed[]>;
  showProfileColumn = false;

  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private transactionService: TransactionService
  ) {
    this.currentUser = null; // otherwise there would be an undefined error because of waiting for the currentUser values to fetch
  }

  ngOnInit(): void {
    this.currentUser$ = this.storeFacade.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      if (user) {
        this.timelineFeed = this.transactionService.getTimelineFeed(user.id);
        this.currentUser = user;
        this.userPhotoURL = this.currentUser.avatarURL;
        this.coverPhotoURL = this.currentUser.coverPhotoURL;
        this.showProfileColumn = true;

        // Loading followings and followers list and adding them to state
        this.storeFacade.loadCurrentUserFollowings(this.currentUser.id);
        this.storeFacade.loadCurrentUserFollowers(this.currentUser.id);
        this.storeFacade.loadUserTransactions(this.currentUser.id);
        this.storeFacade.loadUserOwnedStocks(this.currentUser.id);
        this.storeFacade.loadAlpacaPositions(this.currentUser.id);

        this.followings$ = this.storeFacade.currentFollowings$;
        this.followers$ = this.storeFacade.currentFollowers$; // can be sent to any other component (as component's input) in future commits
        this.userTransactions$ = this.storeFacade.userTransactions$;
        this.userOwnedStocks$ = this.storeFacade.userOwnedStocks$;
        this.alpacaPositions$ = this.storeFacade.userAlpacaPositions$;
      }
    });
  }
}
