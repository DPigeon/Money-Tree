import { userLogin } from './../../store/actions/app.actions';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { User } from '../../interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  logInForm: FormGroup;
  email: AbstractControl;
  pwd: AbstractControl;

  constructor(fb: FormBuilder, private storeFacade: StoreFacadeService) {
    this.storeFacade.currentUser$.subscribe((val) => {
      if (val) {
        console.log(
          'The user with firstname: ',
          val.firstName,
          ' and username: ',
          val.username,
          ' has been signed in successfully.'
        );
      }
    });

    this.storeFacade.appError$.subscribe((val) => {
      if (val) {
        // we don't want to show an error message on our console before user clicked on login
        console.log('Userjan could not be found.');
      }
    });

    this.logInForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pwd: ['', Validators.compose([Validators.required])],
    });

    this.email = this.logInForm.controls['email'];
    this.pwd = this.logInForm.controls['pwd'];
  }
  onSubmit(value: any): void {
    if (this.logInForm.valid) {
      const userCredentials: User = {
        email: this.email.value,
        password: this.pwd.value,
      };

      this.storeFacade.userLogin(userCredentials);
    }
  }
  ngOnInit(): void {}
  getFirstErrorMessage(): string {
    // Only 1 error msg is shown at a time, the first input field error is prior to second, and same for next ones
    if (this.logInForm.touched && this.logInForm.invalid) {
      // tslint:disable-next-line:forin
      for (const field in this.logInForm.controls) {
        const control = this.logInForm.get(field);
        if (control.invalid && control.touched) {
          // all failed validators are available in control.errors which is an object
          // and to get the names of failed validators we need the keys in errors Object
          const allErrorNames = Object.keys(control.errors);
          const result = field + ',' + allErrorNames[0]; // the resslt would be for example "firstName,required"
          return result;
        }
      }
    }
  }
  showErrorMessage(): string {
    const failedValidator = this.getFirstErrorMessage();

    // to go around null errors in console for when we dont have any failed validators.
    if (failedValidator) {
      switch (failedValidator) {
        case 'email,required':
        case 'pwd,required':
          return 'Please fill out all the required fields.';

        case 'email,email':
          return 'Email is not in the valid format.';

        default:
          return '';
      }
    }
  }
}
