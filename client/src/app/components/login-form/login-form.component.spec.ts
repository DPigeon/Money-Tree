import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AppError } from 'src/app/interfaces/app-error';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from 'src/app/shared.module';
import { LoginFormComponent } from './login-form.component';

const userCredentials: User = {
  email: 'test@gmail.com',
  password: 'Hunter2',
};

const appError: AppError = {
  status: '',
  message: '',
  debugMessage: '',
  timestamp: '',
};

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [LoginFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit login event for valid creditential format', () => {
    spyOn(component.userLogin, 'emit');
    component.email.setValue(userCredentials.email);
    component.pwd.setValue(userCredentials.password);
    component.email.markAsTouched();
    component.pwd.markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.userLogin.emit).toHaveBeenCalledWith(userCredentials);
    expect(component.showErrorMessage()).toBe('');
  });

  it('should display the correct form error messages', () => {
    spyOn(component.userLogin, 'emit');
    component.email.markAsTouched();
    component.pwd.markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.showErrorMessage()).toBe(
      'Please fill out all the required fields.'
    );
    component.pwd.setValue(userCredentials.password);
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Please fill out all the required fields.'
    );
    component.email.setValue('bademailformat@..');
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Email is not in the valid format.'
    );
    expect(component.userLogin.emit).toHaveBeenCalledTimes(0);
  });

  it('should show no error messages ahout form fields entries if appError is not null', () => {
    component.appError = null;
    component.getFirstErrorMessage = () => 'a new error for failedValidator';
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe('');
  });

  it('should detect wrongCredentials based on appError message', () => {
    appError.message = 'Credentials not found';
    component.appError = appError;
    fixture.detectChanges();
    expect(component.wrongCredential()).toBe(true);
  });

  it('should disable the login button if at least one form field is not valid.', () => {
    component.pwd.setErrors({ required: true });
    fixture.detectChanges();
    expect(component.disableButton()).toBe(true);
  });
});
