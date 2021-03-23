import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {
  @Input() currentProfileUser: UserProfile;
  constructor() { }
  
  ngOnInit(): void {

  }
  //display text on the follow button (edit-profile if own profile)
  buttonText(): string {
    let text = 'unFollow';
    // if current user profile == current logged user => return "edit profile"
    // if current user in following => return "unFollow"
    // else return "follow"

    
    return text;
  }
  bioText(): string {
    return this.currentProfileUser.biography.length > 0 ? this.currentProfileUser.biography : 'This user has no biography yet.';
  }

}
