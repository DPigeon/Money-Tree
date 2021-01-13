import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { resultMemoize } from '@ngrx/store';
import { AppError } from 'src/app/interfaces/app-error';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Output() userLogin: EventEmitter<User> = new EventEmitter();
  @Input() appError: AppError;
  logInForm: FormGroup;
  email: AbstractControl;
  pwd: AbstractControl;
  submitted = false;

  constructor(fb: FormBuilder) {
    this.logInForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pwd: ['', Validators.compose([Validators.required])],
    });

    this.email = this.logInForm.controls.email;
    this.pwd = this.logInForm.controls.pwd;
  }

  onSubmit(): void {
    if (this.logInForm.valid) {
      this.submitted = true;
      const userCredentials: User = {
        email: this.email.value,
        password: this.pwd.value,
      };
      this.userLogin.emit(userCredentials);
    }
  }

  getFirstErrorMessage(): string {
    // Only 1 error msg is shown at a time, the first input field error is prior to second, and same for next ones
    if (this.logInForm.touched && this.logInForm.invalid) {
      for (const field in this.logInForm.controls) {
        if (
          this.logInForm.get(field).invalid &&
          this.logInForm.get(field).touched
        ) {
          // all failed validators are available in control.errors which is an object
          // and to get the names of failed validators we need the keys in errors Object
          const allErrorNames = Object.keys(this.logInForm.get(field).errors);
          const result = field + ',' + allErrorNames[0]; // the result would be for example "firstName,required"
          return result;
        }
      }
    }
    return '';
  }

  showErrorMessage(): string {
    const failedValidator = this.getFirstErrorMessage();

    // to go around null errors in console for when we dont have any failed validators.
    if (failedValidator && !this.appError) {
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
    return '';
  }
  wrongCredential(): boolean {
    const result =
      this.appError && this.appError.message === 'Credentials not found';
    if (result) {
      this.submitted = false;
    }
    return result;
  }
}
