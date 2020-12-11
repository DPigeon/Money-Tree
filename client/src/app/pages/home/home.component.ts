import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser$: Observable<User>;

  constructor(private storeFacade: StoreFacadeService, public dialog: MatDialog) {

    this.currentUser$ = this.storeFacade.currentUser$;
  }

  ngOnInit(): void {
  }
  openDialog() {
    this.dialog.open(EditProfileComponent);
  }
}
