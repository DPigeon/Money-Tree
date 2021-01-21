import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser$: Observable<User>;
  currentUser: User;

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
      }
    });
  }
  openDialog(): void {
    this.dialog.open(EditProfileComponent, { data: this.currentUser });
  }
}
