import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { LoginSignupComponent } from './login-signup.component';
import { MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES, NGRX_STORE_MODULE } from '../../shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const fakeActivatedRoute = {
  queryParams: of(null),
} as any;

const fakeRoute = {
  navigate: jest.fn()
}

describe('LoginSignupComponent', () => {
  let component: LoginSignupComponent;
  let fixture: ComponentFixture<LoginSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [LoginSignupComponent, SignupFormComponent, LoginFormComponent],
      providers: [
        NGRX_STORE_MODULE,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: fakeRoute },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
