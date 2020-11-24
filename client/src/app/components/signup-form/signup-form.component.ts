import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
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
  // errorMessages: string[];

  errTemplates = {
    // -- camelCase
    reqFirstName: 'First name cannot be empty.',
    reqLastName: 'Last name cannot be empty.',
    reqPwd: 'Password cannot be empty.',
    // --
    minLengthFirstName: 'First name has to be at least 3 characters.',
    minLengthLastName: 'Last name has to be at least 3 characters.',
    // --
    maxLengthFirstName: 'First name cannot contain more than 20 characters.',
    maxLengthLastName: 'Last name cannot contain more than 20 characters.',
    // --
    reqEmail: 'Email cannot be empty.',
    emailFormat: 'Email is not valid.' ,
    // --
    patternFirstName: 'First name cannot contain numbers or space.',
    patternLastName: 'Last name cannot contain numbers or space.',
    patternPwd: 'Password must be at least 8 characters including at least one number, one letter and one special character.'
    // --
  };

  constructor(fb: FormBuilder, private storeFacade: StoreFacadeService) {
    this.storeFacade.currentUser$.subscribe(val => {
      console.log('the user has been created', val);
    });

    this.storeFacade.appError$.subscribe(val => {
      console.log('error', val);
    });

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
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/u
            // at least 8 characters, with one number, one letter and one symbol
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
    // this.errorMessages = this.errMsgCreator();
  }

  onSubmit(value: any): void {
    this.isSubmitted = true;
    console.log('you submitted value:', value);
    if(this.signUpForm.valid) {
      const newUser: any = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        password: this.pwd.value,
        email: this.email.value,
      };
      this.storeFacade.createNewUser(newUser);
    }
  }
  ngOnInit(): void {}
}
// custom validator for password match:
// function pwd2Validator(control: FormControl): { [s: string]: boolean } {
//   if (!control.value === getPwd2()) {
//     return { invalidPwd2: true };
//   }
// }
