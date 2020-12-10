import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {
  @Output() userSignup: EventEmitter<User> = new EventEmitter();
  @Input() appError: boolean;
  signUpForm: FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  username: AbstractControl;
  email: AbstractControl;
  pwd: AbstractControl;
  pwd2: AbstractControl;

  constructor(fb: FormBuilder) {
    this.signUpForm = fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z]{3,20}$/u), // validate the pattern to match this regex
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z]{3,20}$/u),
          ]),
        ],
        userName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z]\w{5,20}$/u),
          ]),
        ],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        pwd: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/u
            ),
          ]),
        ],
        pwd2: ['', Validators.compose([Validators.required])],
      },
      { validator: passwordMatch } // This would be a custom validator to check whether passwords matched.
    );

    this.firstName = this.signUpForm.controls.firstName;
    this.lastName = this.signUpForm.controls.lastName;
    this.username = this.signUpForm.controls.userName;
    this.email = this.signUpForm.controls.email;
    this.pwd = this.signUpForm.controls.pwd;
    this.pwd2 = this.signUpForm.controls.pwd2;
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const newUser: User = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        password: this.pwd.value,
        email: this.email.value,
        username: this.username.value,
      };
      this.userSignup.emit(newUser);
    }
  }

  getFirstErrorMessage(): string {
    if (this.signUpForm.hasError('pwdsDidntMatch') && this.pwd2.dirty) {
      return 'pwds,match';
    }
    // Only 1 error msg is shown at a time, the first input field error is prior to second, and same for next ones
    if (this.signUpForm.touched && this.signUpForm.invalid) {
      for (const field in this.signUpForm.controls) {
        if (
          this.signUpForm.get(field).invalid &&
          this.signUpForm.get(field).touched
        ) {
          // all failed validators are available in control.errors which is an object
          // and to get the names of failed validators we need the keys in errors Object
          const allErrorNames = Object.keys(this.signUpForm.get(field).errors);
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
        case 'firstName,required':
        case 'lastName,required':
        case 'userName,required':
        case 'email,required':
        case 'pwd,required':
        case 'pwd2,required':
          return 'Please fill out all the required fields.';

        case 'firstName,pattern':
        case 'lastName,pattern':
          return 'First/Last name should be of length 3-20 characters with no numbers/spaces.';

        case 'userName,pattern':
          return 'Username has to be at least 6 characters starting with an alphabet.';

        case 'email,email':
          return 'Email is not in the valid format.';

        case 'pwd,pattern':
          return 'Password must contain at least 8 characters, including one number, one letter and one of these special characters: @$!%*#?&';

        case 'pwds,match':
          return 'Passwords do not match, please check.';
      }
    }
  }
}
function passwordMatch(frm: FormGroup): { [key: string]: boolean } { // custom validator
  return frm.get('pwd').value === frm.get('pwd2').value
    ? null
    : { pwdsDidntMatch: true };
}
