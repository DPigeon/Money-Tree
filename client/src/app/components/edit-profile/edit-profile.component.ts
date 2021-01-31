import { Component, EventEmitter, Inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../interfaces/user';
import { AppError } from '../../interfaces/app-error';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  @Input() appError: AppError;

  editProfileForm: FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  biography: AbstractControl;
  newPwd: AbstractControl;
  newPwd2: AbstractControl;
  submitted = false;

  userPhotoURL: string | ArrayBuffer;
  temporaryPhotoFile: File = null;
  pictureErrMessage: string = null;

  userUpdate: EventEmitter<User> = new EventEmitter();
  userPhotoUpdate: EventEmitter<File> = new EventEmitter();

  constructor(
    fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public userInState: User
  ) {
    this.editProfileForm = fb.group(
      {
        firstName: [
          userInState.firstName, // initial value from current user in state
          Validators.compose([
            Validators.pattern(/^[a-zA-Z]{3,20}$/u), // validate the pattern to match this regex
            Validators.required,
          ]),
        ],
        lastName: [
          userInState.lastName,
          Validators.compose([
            Validators.pattern(/^[a-zA-Z]{3,20}$/u),
            Validators.required,
          ]),
        ],
        biography: [
          userInState.biography,
          Validators.compose([
            Validators.minLength(10),
            Validators.maxLength(250),
          ]),
        ],
        newPwd: [
          null,
          Validators.compose([
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])[\S]{8,}$/u
            ),
          ]),
        ],
        newPwd2: null,
      },
      { validator: passwordMatch } // This would be a custom validator to check whether passwords matched.
    );
    this.userPhotoURL = userInState.avatarURL;
    this.firstName = this.editProfileForm.controls.firstName;
    this.lastName = this.editProfileForm.controls.lastName;
    this.biography = this.editProfileForm.controls.biography;
    this.newPwd = this.editProfileForm.controls.newPwd;
    this.newPwd2 = this.editProfileForm.controls.newPwd2; // this function return false if user put old values in input fileds.
  }

  onSubmit(): void {
    this.submitted = true;
    this.appError = null; // to disable the button when we have an appError and user tries to click multiple times
    if (this.goodPhotoLoaded()) {
      if (this.fieldsChanged()) {
        setTimeout(() => {
          this.userPhotoUpdate.emit(this.temporaryPhotoFile);
        }, 1000);
        // in case user is changing both the photo, and some of the fileds,
        // we have to wait for the general update to finish updating state and then emit this event
      } else {
        this.userPhotoUpdate.emit(this.temporaryPhotoFile);
      }
    }
    if (this.fieldsChanged()) {
      const updatedUser = { ...this.userInState };
      if (this.newPwd.value) {
        updatedUser.password = this.newPwd.value;
      }
      updatedUser.firstName = this.firstName.value;
      updatedUser.lastName = this.lastName.value;
      updatedUser.biography = this.biography.value;
      this.userUpdate.emit(updatedUser);
    }
    this.dialogRef.close();
  }

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
        case 'firstName,required':
        case 'lastName,required':
          return 'First/Last name should not be empty.';
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

  onFileSelected(event: Event): void {
    this.temporaryPhotoFile = (event.target as HTMLInputElement).files[0];
    const size = this.temporaryPhotoFile.size;
    const type = this.temporaryPhotoFile.type;

    if (type !== 'image/jpeg' && type !== 'image/png') {
      this.pictureErrMessage =
        'The photo must be a file of type: jpeg, png, jpg!';
      this.userPhotoURL = this.userInState.avatarURL;
      this.temporaryPhotoFile = null;
      return;
    } else if (size > 1048576) {
      this.pictureErrMessage = 'Photo must be smaller than 1.0 MB!';
      this.userPhotoURL = this.userInState.avatarURL;
      this.temporaryPhotoFile = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => (this.userPhotoURL = reader.result);
    reader.readAsDataURL(this.temporaryPhotoFile);
    this.userPhotoURL = this.sanitizeImageUrl(
      URL.createObjectURL(this.temporaryPhotoFile)
    ) as string;
    this.pictureErrMessage = null; // image type/size is valid
  }

  fieldsChanged(): boolean {
    return (
      this.firstName.value !== this.userInState.firstName ||
      this.lastName.value !== this.userInState.lastName ||
      this.biography.value !== this.userInState.biography ||
      this.newPwd.dirty
    );
  }
  goodPhotoLoaded(): boolean {
    return this.pictureErrMessage === null && this.temporaryPhotoFile !== null;
  }

  disableButton(): boolean {
    if (
      !this.editProfileForm.valid ||
      (!this.goodPhotoLoaded() &&
        !!this.editProfileForm.valid &&
        !this.fieldsChanged())
    ) {
      return true;
    }
    if (this.submitted) {
      return true; // to prevent multiple clicks
    }
    return false;
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    // otherwise the browser will complaint about unsafe url
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
  cancelPhoto(): void {
    this.temporaryPhotoFile = null;
    this.userPhotoURL = this.userInState.avatarURL;
  }
}

function passwordMatch(frm: FormGroup): { [key: string]: boolean } {
  return frm.get('newPwd').value === frm.get('newPwd2').value
    ? null
    : { pwdsDidntMatch: true };
}
