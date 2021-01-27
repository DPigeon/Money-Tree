import { UserService } from 'src/app/services/user/user.service';
import { Component, Input, OnInit, Output } from '@angular/core';
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
  @Output() userPhotoUrl: string;
  currentUser$: Observable<User>;
  currentUser: User;

  constructor(
    private storeFacade: StoreFacadeService,
    public dialog: MatDialog,
    private userService: UserService
  ) {
    this.currentUser = null; // otherwise there would be an undefined error because of waiting for the currentUser values to fetch
  }

  ngOnInit(): void {
    this.currentUser$ = this.storeFacade.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        this.userPhotoUrl = this.currentUser.avatarURL;
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: this.currentUser,
      disableClose: true,
    });

    dialogRef.componentInstance.userPhotoUpdate.subscribe((imageFile: File) => {
      this.userService
        .updateProfilePictureUrl(this.currentUser.id, imageFile)
        .subscribe((res) => {
          const updatedUser = { ...this.currentUser };
          updatedUser.avatarURL = res.body.avatarURL;
          this.storeFacade.updateUser(updatedUser);
        });
    });
  }
}
