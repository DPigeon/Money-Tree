import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser$: Observable<User>;

  constructor(private storeFacade: StoreFacadeService) {
    this.currentUser$ = this.storeFacade.currentUser$;
   }

  ngOnInit(): void {
  }

}
