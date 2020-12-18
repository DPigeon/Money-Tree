import { Component, OnInit } from '@angular/core';


export interface ProfileData {
  firstName: string;
  lastName: string;
  password: string;
  biography: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit {
  constructor( ) { }
  ngOnInit(): void {
  }
}
