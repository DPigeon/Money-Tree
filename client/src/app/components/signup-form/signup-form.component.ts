import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit {
  signUpForm: FormGroup;
  isSubmitted = false;
  // this will help to have controllers as simple as possible in template, otherwise it would be: signUpForm.controls['firstName']
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;
  pwd: AbstractControl;
  pwd2: AbstractControl;

  constructor(fb: FormBuilder, private storeFacade: StoreFacadeService) {
    this.storeFacade.currentUser$.subscribe((val) => {
      console.log('the user has been created', val);
    });

    this.storeFacade.appError$.subscribe((val) => {
      console.log('error', val);
    });

    this.signUpForm = fb.group({
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
      email: ['', Validators.compose([Validators.required, Validators.email])],
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
    });

    this.firstName = this.signUpForm.controls['firstName'];
    this.lastName = this.signUpForm.controls['lastName'];
    this.email = this.signUpForm.controls['email'];
    this.pwd = this.signUpForm.controls['pwd'];
    this.pwd2 = this.signUpForm.controls['pwd2'];
  }

  onSubmit(value: any): void {
    this.isSubmitted = true;
    console.log('you submitted value:', value);
    if (this.signUpForm.valid) {
      const newUser: any = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        password: this.pwd.value,
        email: this.email.value,
        username: 'alex56'
      };
      this.storeFacade.createNewUser(newUser);
    }
  }
  ngOnInit(): void {}

  getFirstErrorMessage(): string {
    // creating pattern (pwd match) validator for confirm password field only if password is already have a value and not null
    if (this.pwd.value) {
      this.pwd2.setValidators([Validators.required, Validators.pattern(new RegExp(this.pwd.value))]);
    }
    // Only 1 error msg is shown at a time, the first input field error is prior to second, and same for next ones
    if (this.signUpForm.touched && this.signUpForm.invalid) {
      // tslint:disable-next-line:forin
      for (const field in this.signUpForm.controls) {
        const control = this.signUpForm.get(field);
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

    if (failedValidator) {
      // to go around null errors in console for when we dont have any failed validators.
      switch (failedValidator) {
        case 'firstName,required':
        case 'lastName,required':
        case 'pwd,required':
        case 'email,required':
        case 'pwd2,required':
          return 'Please fill out all the required fields.';

        case 'firstName,pattern':
        case 'lastName,pattern':
          return 'First/Last name should be of length 3-20 characters with no numbers/spaces.';

        case 'email,email':
          return 'Email is not in the valid format.';

        case 'pwd,pattern':
          return 'Password must be at least 8 characters, with one number, one letter and one symbol.';

        case 'pwd2,pattern':
          return 'Passwords do not match, please check.';
        default:
          return '';
      }
    }
  }
}
