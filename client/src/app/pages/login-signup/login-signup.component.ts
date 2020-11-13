import { Component, OnInit } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';


@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {
investors: string = "for investors.";
  constructor() { }

  ngOnInit(): void {
  }

}
