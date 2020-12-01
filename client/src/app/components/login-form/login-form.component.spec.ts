import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from 'src/app/interfaces/user';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from 'src/app/shared.module';
import { LoginFormComponent } from './login-form.component';

const userCredentials: User = {
  email: 'test@gmail.com',
  password: 'Hunter2',
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
    component.logInForm.controls['email'].setValue(userCredentials.email);
    component.logInForm.controls['pwd'].setValue(userCredentials.password);
    component.logInForm.controls['email'].markAsTouched();
    component.logInForm.controls['pwd'].markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.userLogin.emit).toHaveBeenCalledWith(userCredentials);
    expect(component.showErrorMessage()).toBe('');
  });

  it('should display the correct form error messages', () => {
    spyOn(component.userLogin, 'emit');
    component.logInForm.controls['email'].markAsTouched();
    component.logInForm.controls['pwd'].markAllAsTouched();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.showErrorMessage()).toBe(
      'Please fill out all the required fields.'
    );
    component.logInForm.controls['pwd'].setValue(userCredentials.password);
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Please fill out all the required fields.'
    );
    component.logInForm.controls['email'].setValue('bademailformat@..');
    fixture.detectChanges();
    expect(component.showErrorMessage()).toBe(
      'Email is not in the valid format.'
    );
    expect(component.userLogin.emit).toHaveBeenCalledTimes(0);
  });
});
