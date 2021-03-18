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
  listTitle: string = null;
  navigateToProfile: EventEmitter<string[]> = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ListOfFollowsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.follows = data.followslist;
    this.listTitle = data.followsTitle;
  }

  print(): void {
    console.log(this.follows);
  }
  navigateToFollowProfile(username: string, userId: string): void {
    this.navigateToProfile.emit([username, userId]);
  }
}
