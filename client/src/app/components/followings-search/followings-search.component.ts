import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-followings-search',
  templateUrl: './followings-search.component.html',
  styleUrls: ['./followings-search.component.scss'],
})
export class FollowingsSearchComponent implements OnInit {
  followings = [
    { firstName: 'Marwan', lastName: 'Ayadi' },
    { firstName: 'Razine', lastName: 'Bensari' },
    { firstName: 'Arthur', lastName: 'Tourneyrie' },
    { firstName: 'Alessandro', lastName: 'Kreslin' },
    { firstName: 'David ', lastName: 'Pigeon' },
    { firstName: 'Abdulrahim', lastName: 'Mansour' },
    { firstName: 'Walter', lastName: 'Fleury' },
    { firstName: 'Hossein', lastName: 'Noor' },
    { firstName: 'Lindsay', lastName: 'Bangs' },
    { firstName: 'Marwan', lastName: 'Ayadi' },
    { firstName: 'Razine', lastName: 'Bensari' },
    { firstName: 'Arthur', lastName: 'Tourneyrie' },
    { firstName: 'Alessandro', lastName: 'Kreslin' },
    { firstName: 'David ', lastName: 'Pigeon' },
    { firstName: 'Abdulrahim', lastName: 'Mansour' },
    { firstName: 'Walter', lastName: 'Fleury' },
    { firstName: 'Hossein', lastName: 'Noor' },
    { firstName: 'Lindsay', lastName: 'Bangs' },
    { firstName: 'Marwan', lastName: 'Ayadi' },
    { firstName: 'Razine', lastName: 'Bensari' },
    { firstName: 'Arthur', lastName: 'Tourneyrie' },
    { firstName: 'Alessandro', lastName: 'Kreslin' },
    { firstName: 'David ', lastName: 'Pigeon' },
    { firstName: 'Abdulrahim', lastName: 'Mansour' },
    { firstName: 'Walter', lastName: 'Fleury' },
    { firstName: 'Hossein', lastName: 'Noor' },
    { firstName: 'Lindsay', lastName: 'Bangs' },
  ]; // to be changed
  followingSearch = '';

  constructor(private router: Router) {}
  ngOnInit(): void {}

  navigateToFollowingProfile(following: string): void {
    this.router.navigate(['/user-profile/' + following]);
  }
  // to be changed
  isSearchedFollowings(following): boolean {
    return (
      following.firstName
        .toLowerCase()
        .indexOf(this.followingSearch.toLowerCase()) > -1 ||
      following.lastName
        .toLowerCase()
        .indexOf(this.followingSearch.toLowerCase()) > -1 ||
      this.followingSearch === ''
    );
  }
}
