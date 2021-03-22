import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-list-of-follows',
  templateUrl: './list-of-follows.component.html',
  styleUrls: ['./list-of-follows.component.scss'],
})
export class ListOfFollowsComponent {
  follows: User[] = null;
  username: string = null;
  listType: string = null;
  navigateToProfile: EventEmitter<string[]> = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ListOfFollowsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.follows = data.followslist;
    this.username = data.username;
    this.listType = data.listType;
  }

  emptyListMessage(): string {
    return this.listType === 'followers'
      ? `${this.username} is not followed by any other user!`
      : `${this.username} is not following any other user!`;
  }

  navigateToFollowProfile(username: string, userId: string): void {
    this.navigateToProfile.emit([username, userId]);
  }
}
