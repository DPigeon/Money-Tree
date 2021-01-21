import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../interfaces/user';
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
  biography: AbstractControl;
  newPwd: AbstractControl;
  newPwd2: AbstractControl;
  userPhotoURL: string | ArrayBuffer;
  temporaryPhotoFile: File;
  pictureErrMessage: string;
  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public userInDb: User
  ) {
    this.editProfileForm = fb.group(
      {
        firstName: [
          userInDb.firstName,
          Validators.compose([
            Validators.pattern(/^[a-zA-Z]{3,20}$/u), // validate the pattern to match this regex
          ]),
        ],
        lastName: [
          userInDb.lastName,
          Validators.compose([Validators.pattern(/^[a-zA-Z]{3,20}$/u)]),
        ],
        biography: [
          userInDb.biography,
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
    this.userPhotoURL = userInDb.avatarURL;
    this.firstName = this.editProfileForm.controls.firstName;
    this.lastName = this.editProfileForm.controls.lastName;
    this.biography = this.editProfileForm.controls.biography;
    this.newPwd = this.editProfileForm.controls.newPwd;
    this.newPwd2 = this.editProfileForm.controls.newPwd2; // this function return false if user put old values in input fileds.
  }
  onSubmit(): void {}
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
          const result = field + ',' + allErrorNames[0]; // the result would be for example "firstName,required"
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

        case 'biography,maxlength':
        case 'biography,minlength':
          return 'Bio has to between 10 to 250 characters.';

        case 'newPwd,pattern':
          return 'Password must contain at least 8 characters, including one number, one symbol, one lowercase and one uppercase letter, and no space.';

        case 'pwds,match':
          return 'Passwords do not match, please check.';
      }
    }
  }
  compareFormValues(): boolean {
    return (
      this.firstName.value === this.userInDb.firstName &&
      this.lastName.value === this.userInDb.lastName &&
      !this.newPwd.dirty &&
      this.biography.value === this.userInDb.biography
    );
  }
  onFileSelected(event: Event): void {
    this.temporaryPhotoFile = (event.target as HTMLInputElement).files[0];
    const size = this.temporaryPhotoFile.size;
    const type = this.temporaryPhotoFile.type;
    if (type !== 'image/jpeg' && type !== 'image/png') {
      this.pictureErrMessage =
        'The photo must be a file of type: jpeg, png, jpg!';
      this.userPhotoURL = this.userInDb.avatarURL;
      return;
    } else if (size > 1000000) {
      this.pictureErrMessage = 'Photo must be smaller than 1.0 MB!';
      this.userPhotoURL = this.userInDb.avatarURL;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => (this.userPhotoURL = reader.result);
    reader.readAsDataURL(this.temporaryPhotoFile);
    this.userPhotoURL = URL.createObjectURL(this.temporaryPhotoFile);
    this.pictureErrMessage = null; // image type/size is valid
  }
}
function passwordMatch(frm: FormGroup): { [key: string]: boolean } {
  return frm.get('newPwd').value === frm.get('newPwd2').value
    ? null
    : { pwdsDidntMatch: true };
}
