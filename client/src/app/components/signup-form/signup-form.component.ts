import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';

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

  errMsg = {
    // --
    required_fn: 'First name cannot be empty.',
    required_ln: 'Last name cannot be empty.',
    pwd_required: 'Password cannot be empty.',
    // --
    min_length_fn: 'First name has to be at least 3 characters.',
    min_length_ln: 'Last name has to be at least 3 characters.',
    min_length_pwd: 'Passwords have to be at least 8 characters.',
    // --
    max_length_fn: 'First name cannot contain more than 20 characters.',
    max_length_ln: 'Last name cannot contain more than 20 characters.',
    max_length_pwd: 'Passwords cannot contain more than 20 characters.',
    // --
    start_fn: 'First name cannot start with blank space or numbers',
    start_ln: 'Last name cannot start with blank space or numbers',
    // --
  };

  constructor(fb: FormBuilder) {
    this.signUpForm = fb.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(
            /^[a-z][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
          ),
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(
            /^[a-z][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
          ),
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pwd: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
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

  onSubmit(value: string): void {
    this.isSubmitted = true;
    console.log('you submitted value:', value);
  }

  ngOnInit(): void {}
}
// custom validator for password match:
// function pwd2Validator(control: FormControl): { [s: string]: boolean } {
//   if (!control.value === getPwd2()) {
//     return { invalidPwd2: true };
//   }
// }
