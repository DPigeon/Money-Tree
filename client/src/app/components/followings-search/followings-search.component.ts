import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-followings-search',
  templateUrl: './followings-search.component.html',
  styleUrls: ['./followings-search.component.scss'],
})
export class FollowingsSearchComponent {
  @Input() followings$: Observable<User[]>;
  followingSearch = '';

  constructor(private router: Router) { }

  navigateToFollowingProfile(username: string): void {
    this.router.navigate(['/profile/' + username]);
  }

  isSearchedFollowings(following: User): boolean {
    return (
      following.firstName
        .toLowerCase()
        .indexOf(this.followingSearch.toLowerCase()) > -1 ||
      following.lastName
        .toLowerCase()
        .indexOf(this.followingSearch.toLowerCase()) > -1 ||
      following.firstName
        .toLowerCase()
        .concat(' ')
        .concat(following.lastName.toLowerCase())
        .indexOf(this.followingSearch.toLowerCase()) > -1 ||
      this.followingSearch === ''
    );
  }
}
