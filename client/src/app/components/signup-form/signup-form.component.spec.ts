import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { AppError } from 'src/app/interfaces/app-error';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { SignupFormComponent } from './signup-form.component';

const appError: AppError = {
  status: '',
  message: '',
  debugMessage: '',
  timestamp: '',
};

// integration test
describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  // create new instance of FormBuilder
  const fb: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [SignupFormComponent],
      providers: [NGRX_STORE_MODULE, { provide: FormBuilder, useValue: fb }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit signup event for valid format data', () => {
    spyOn(component.userSignup, 'emit');
    component.firstName.setValue('john');
    component.lastName.setValue('doe');
    component.username.setValue('johndoe');
    component.email.setValue('johndoe@gmail.com');
    component.pwd.setValue('Qwer@123');
    component.pwd2.setValue('Qwer@123');
    fixture.detectChanges();
    component.onSubmit();
    const newUser: User = {
      firstName: 'john',
      lastName: 'doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: 'Qwer@123',
    };
    expect(component.userSignup.emit).toHaveBeenCalledWith(newUser);
    expect(component.showErrorMessage()).toBe(undefined);
  });

  it('should show an error if first name is less than 3 characters', () => {
    component.firstName.setValue('jo');
    component.lastName.setValue('doe');
    component.firstName.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'First/Last name should be of length 3-20 characters with no numbers/spaces.'
    );
  });

  it('should show an error if last name contains numbers', () => {
    component.firstName.setValue('john');
    component.lastName.setValue('doe1');
    component.lastName.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'First/Last name should be of length 3-20 characters with no numbers/spaces.'
    );
  });
  it('should show an error if email is in a wrong format', () => {
    component.email.setValue('emailwithoutAtsign');
    component.firstName.setValue('john');
    component.email.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Email is not in the valid format.'
    );
  });

  it('should show an error if username starts with a number', () => {
    component.username.setValue('0username');
    component.email.setValue('abc@gmail.com');
    component.username.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Username has to be at least 6 characters starting with an alphabet.'
    );
  });
  it('should show an error if password is not in the right format', () => {
    component.pwd.setValue('passWithoutNumber');
    component.email.setValue('abc@gmail.com');
    component.pwd.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Password must contain at least 8 characters, including one number, one symbol, one lowercase and one uppercase letter, and no space.'
    );
  });

  it('should show an error if one of the input fields left empty', () => {
    component.pwd2.markAsTouched();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Please fill out all the required fields.'
    );
  });
  it('should show an error if the passwords do not match', () => {
    component.pwd.setValue('Qwer@123');
    fixture.detectChanges();
    component.pwd2.setValue('AnotherPassword1@@');
    component.pwd.markAsTouched();
    component.pwd2.markAsTouched();
    component.pwd2.markAsDirty();
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Passwords do not match, please check.'
    );
  });

  it('should show no error messages ahout form fields entries if appError is not null', () => {
    component.appError = null;
    component.getFirstErrorMessage = () => 'a new error for failedValidator';
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe('');
  });

  it('should detect if username/email already exist based on appError message', () => {
    appError.message = 'Email or username already exists!';
    component.appError = appError;
    fixture.detectChanges();
    expect(component.userAlreadyExist()).toBe(true);
  });

  it('should disable the sign up button if at least one form field is not valid.', () => {
    component.pwd.setErrors({ required: true });
    fixture.detectChanges();
    expect(component.disableButton()).toBe(true);
  });
});
