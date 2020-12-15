import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user';

// export interface ProfileData {
//   firstName: string;
//   lastName: string;
//   password: string;
//   biography: string;
// }

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  // @Output() userSignup: EventEmitter<User> = new EventEmitter();
  // @Input() appError: boolean;
  editProfileForm: FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  bio: AbstractControl;
  newPwd: AbstractControl;
  newPwd2: AbstractControl;
  constructor(fb: FormBuilder) {
    this.editProfileForm = fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.pattern(/^[a-zA-Z]{3,20}$/u), // validate the pattern to match this regex
          ]),
        ],
        lastName: [
          '',
          Validators.compose([Validators.pattern(/^[a-zA-Z]{3,20}$/u)]),
        ],
        bio: [
          '',
          Validators.compose([
            Validators.minLength(10),
            Validators.maxLength(250),
          ]),
        ],
        newPwd: [
          '',
          Validators.compose([
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])[\S]{8,}$/u
            ),
          ]),
        ],
        newPwd2: '',
      },
      { validator: passwordMatch } // This would be a custom validator to check whether passwords matched.
    );

    this.firstName = this.editProfileForm.controls.firstName;
    this.lastName = this.editProfileForm.controls.lastName;
    this.bio = this.editProfileForm.controls.bio;
    this.newPwd = this.editProfileForm.controls.newPwd;
    this.newPwd2 = this.editProfileForm.controls.newPwd2;
  }

  // onSubmit(): void {
  //   if (this.editProfileForm.valid) {
  //     const newUser: User = {
  //       firstName: this.firstName.value,
  //       lastName: this.lastName.value,
  //       password: this.newPwd.value,
  //       email: this.email.value,
  //       username: this.username.value,
  //     };
  //     this.userSignup.emit(newUser);
  //   }
  // }

  getFirstErrorMessage(): string {
    if (
      this.newPwd2.dirty &&
      this.newPwd.valid &&
      this.editProfileForm.hasError('pwdsDidntMatch')
    ) {
      return 'pwds,match';
    }
    // Only 1 error msg is shown at a time, the first input field error is prior to second, and same for next ones
    if (this.editProfileForm.touched && this.editProfileForm.invalid) {
      for (const field in this.editProfileForm.controls) {
        if (
          this.editProfileForm.get(field).invalid &&
          this.editProfileForm.get(field).touched
        ) {
          // all failed validators are available in control.errors which is an object
          // and to get the names of failed validators we need the keys in errors Object
          const allErrorNames = Object.keys(
            this.editProfileForm.get(field).errors
          );
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
        case 'firstName,pattern':
        case 'lastName,pattern':
          return 'First/Last name should be of length 3-20 characters with no numbers/spaces.';

        case 'bio,maxlength':
        case 'bio,minlength':
          return 'Bio has to between 10 to 250 characters.';

        case 'newPwd,pattern':
          return 'Password must contain at least 8 characters, including one number, one symbol, one lowercase and one uppercase letter, and no space.';

        case 'pwds,match':
          return 'Passwords do not match, please check.';
      }
    }
  }
}
function passwordMatch(frm: FormGroup): { [key: string]: boolean } {
  return frm.get('newPwd').value === frm.get('newPwd2').value
    ? null
    : { pwdsDidntMatch: true };
}
