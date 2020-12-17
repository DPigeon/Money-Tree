import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';
import { ProfileData } from '../../interfaces/profileData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser$: Observable<User>;
  profileData: ProfileData;

  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog
  ) {
    this.profileData = {
      // otherwise there would be an undefined error because of waiting for the currentUser values to fetch
      firstName: '',
      lastName: '',
      biography: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.currentUser$ = this.storeFacade.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      if (user) {
        this.profileData.firstName = user.firstName;
        this.profileData.lastName = user.lastName;
        this.profileData.biography = user.biography;
        this.profileData.password = user.password;
      }
    });
  }
  openDialog(): void {
    this.dialog.open(EditProfileComponent, { data: this.profileData });
  }
}
