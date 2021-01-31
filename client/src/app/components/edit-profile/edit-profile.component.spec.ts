import { DomSanitizer} from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';
import { FormBuilder } from '@angular/forms';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  const fb: FormBuilder = new FormBuilder();
  URL.createObjectURL = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        MatDialogModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: fb },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: () => 'safeString',
            bypassSecurityTrustUrl: (imageUrl: string) => 'safeString',
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            firstName: 'John',
            lastName: 'Doe',
            biography: null,
            password: 'Qwerty@123',
            avatarURL: 'avatarURLforJohn',
          },
        },
      ],
      declarations: [EditProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the photoUpdate event only, if good photo was chosen but fields are not changed', () => {
    spyOn(component.userPhotoUpdate, 'emit');
    spyOn(component.userUpdate, 'emit');
    const fakeFile = new File([''], 'largeImage.png');
    component.temporaryPhotoFile = fakeFile;
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.userPhotoUpdate.emit).toHaveBeenCalledWith(fakeFile);
    expect(component.userUpdate.emit).not.toHaveBeenCalled();
  });

  it('should emit the userUpdate event only, if photo was not chosen but fields are changed', () => {
    spyOn(component.userPhotoUpdate, 'emit');
    spyOn(component.userUpdate, 'emit');
    component.firstName.setValue('jack');
    component.lastName.setValue('brown');
    component.biography.setValue('this is the bio str for jack brown');
    component.newPwd.setValue('Qwer@123456');
    component.newPwd2.setValue('Qwer@123456');
    component.editProfileForm.markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.userPhotoUpdate.emit).not.toHaveBeenCalled();
    expect(component.userUpdate.emit).toHaveBeenCalledWith({
      firstName: 'jack',
      lastName: 'brown',
      biography: 'this is the bio str for jack brown',
      avatarURL: 'avatarURLforJohn',
      password: 'Qwer@123456',
    });
  });

  it('should emit both userUpdate and userPhotoUpdate events, if a good photo was chosen and some of the fields are changed', () => {
    spyOn(component.userPhotoUpdate, 'emit');
    spyOn(component.userUpdate, 'emit');
    jest.useFakeTimers();

    const fakeFile = new File([''], 'largeImage.png');
    component.temporaryPhotoFile = fakeFile;
    fixture.detectChanges();
    fixture.detectChanges();

    component.lastName.setValue('brown');
    component.biography.setValue('this is the bio str for John brown');
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    jest.advanceTimersByTime(1000);
    expect(component.userPhotoUpdate.emit).toHaveBeenCalledWith(fakeFile);
    expect(component.userUpdate.emit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'brown',
      biography: 'this is the bio str for John brown',
      avatarURL: 'avatarURLforJohn',
      password: 'Qwerty@123',
    });
    expect(component.userPhotoUpdate.emit).toHaveBeenCalledTimes(1);
    expect(component.userUpdate.emit).toHaveBeenCalledTimes(1);
  });

  it('should see the fields have changed if a form field is not the same as state value', () => {
    expect(component.fieldsChanged()).toBe(false);
    component.firstName.setValue('SomeOtherName');
    expect(component.fieldsChanged()).toBe(true);
  });

  it('should show "required" error message for first name if user change it to empty', () => {
    component.firstName.markAsTouched();
    component.firstName.setValue('');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'First/Last name should not be empty.'
    );
  });

  it('should show "length" error message for first name', () => {
    component.firstName.markAsTouched();
    component.firstName.setValue('ab');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'First/Last name should be of length 3-20 characters with no numbers/spaces.'
    );
  });

  it('should show "length" error message for bio', () => {
    component.biography.markAsTouched();
    component.biography.setValue('ab');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'Bio has to between 10 to 250 characters.'
    );
  });

  it('should show correct "pwd" error messages', () => {
    component.newPwd.markAsTouched();
    component.newPwd.setValue('Qwer@4');
    component.newPwd2.markAsTouched();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'Password must contain at least 8 characters, including one number, one symbol, one lowercase and one uppercase letter, and no space.'
    );
    component.newPwd.markAsTouched();
    component.newPwd.setValue('Qwer@1234');
    fixture.detectChanges();
    component.newPwd2.markAsTouched();
    component.newPwd2.setValue('Q');
    component.newPwd2.markAsDirty();
    fixture.detectChanges();
    component.newPwd.markAsTouched();
    fixture.detectChanges();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'Passwords do not match, please check.'
    );
  });
  it('should show "length" error message for bio', () => {
    component.biography.markAsTouched();
    component.biography.setValue('ab');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.editProfileForm.valid).toBe(false);
    expect(component.showErrorMessage()).toEqual(
      'Bio has to between 10 to 250 characters.'
    );
  });

  it('should show error message for large image file input', () => {
    const fakeFile = new File([''], 'largeImage');
    Object.defineProperty(fakeFile, 'size', { value: 1024 * 1024 + 1 }); // ie: 1048577 whichi is >1048576
    Object.defineProperty(fakeFile, 'type', { value: 'image/png' }); // ie: 1048577 whichi is >1048576
    component.temporaryPhotoFile = fakeFile;
    const event = {
      target: { files: [fakeFile] },
    };

    fixture.detectChanges();
    component.onFileSelected((event as unknown) as Event);
    fixture.detectChanges();
    expect(component.userPhotoURL).toEqual('avatarURLforJohn');
    expect(component.pictureErrMessage).toBe(
      'Photo must be smaller than 1.0 MB!'
    );
    expect(component.temporaryPhotoFile).toBe(null);
  });

  it('should show error message for non image file input', () => {
    const fakeFile = new File([''], 'nonImageFile');
    Object.defineProperty(fakeFile, 'size', { value: 1024 * 1024 }); // good size this time
    Object.defineProperty(fakeFile, 'type', { value: 'nonImage' });
    component.temporaryPhotoFile = fakeFile;
    const event = {
      target: { files: [fakeFile] },
    };

    fixture.detectChanges();
    component.onFileSelected((event as unknown) as Event);
    fixture.detectChanges();
    expect(component.userPhotoURL).toEqual('avatarURLforJohn');
    expect(component.pictureErrMessage).toBe(
      'The photo must be a file of type: jpeg, png, jpg!'
    );
    expect(component.temporaryPhotoFile).toBe(null);
  });

  it('should successfully show a good photo in the browser (before upload)', () => {
    const fakeFile = new File([''], 'GoodImage');
    Object.defineProperty(fakeFile, 'size', { value: 1024 * 1024 }); // good size this time
    Object.defineProperty(fakeFile, 'type', { value: 'image/png' });
    component.temporaryPhotoFile = fakeFile;
    const event = {
      target: { files: [fakeFile] },
    };

    fixture.detectChanges();
    component.onFileSelected((event as unknown) as Event);
    fixture.detectChanges();
    expect(component.userPhotoURL).toEqual('safeString'); // sanitized url
    expect(component.pictureErrMessage).toBe(null);
    expect(component.temporaryPhotoFile).toBe(fakeFile);
  });

  it('should validate photos', () => {
    const fakeFile = new File([''], 'largeImage.png');
    component.temporaryPhotoFile = fakeFile;
    expect(component.goodPhotoLoaded()).toBe(true);
  });

  it('should disable submit button if form fields are not valid', () => {
    component.firstName.markAsTouched();
    component.firstName.setValue('');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.disableButton()).toBe(true);
    component.firstName.markAsTouched();
    component.firstName.setValue('Johnny');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.disableButton()).toBe(false);
    component.temporaryPhotoFile = null;
    fixture.detectChanges();
    expect(component.disableButton()).toBe(false);
  });

  it('should not let multiple clicks on submit button', () => {
    component.submitted = true;
    fixture.detectChanges();
    expect(component.disableButton()).toBe(true);
  });

  it('should disable submission button on loading the component', () => {
    fixture.detectChanges();
    expect(component.disableButton()).toBe(true);
  });

  it('should remove the photo if user clicks on cancel photo button ', () => {
    const fakeFile = new File([''], 'largeImage.png');
    component.temporaryPhotoFile = fakeFile;
    fixture.detectChanges();
    component.cancelPhoto();
    fixture.detectChanges();
    expect(component.temporaryPhotoFile).toBe(null);
    expect(component.userPhotoURL).toBe('avatarURLforJohn');
  });
});

