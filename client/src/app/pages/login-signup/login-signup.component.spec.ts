import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { LoginSignupComponent } from './login-signup.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const fakeActivatedRoute = {
  queryParams: of(null),
} as any;

const fakeRoute = {
  navigate: jest.fn(),
} as any;

const mockStoreFacade = {
  userLogin: jest.fn(),
  createNewUser: jest.fn(),
  updateUser: jest.fn(),
} as any;

describe('LoginSignupComponent', () => {
  let component: LoginSignupComponent;
  let fixture: ComponentFixture<LoginSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [
        LoginSignupComponent,
        SignupFormComponent,
        LoginFormComponent,
      ],
      providers: [
        NGRX_STORE_MODULE,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: fakeRoute },
      ],
    }).compileComponents();
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

describe('LoginSignupComponent Unit Test', () => {
  let component: LoginSignupComponent;

  beforeEach(() => {
    component = new LoginSignupComponent(
      mockStoreFacade,
      fakeActivatedRoute,
      fakeRoute
    );
  });

  it('should call the handle user login', () => {
    spyOn(mockStoreFacade, 'userLogin').and.callThrough();
    const fakeUser = { email: 'hi@gmail.com', password: 'Hunter2' };
    component.handleUserLogin(fakeUser);
    expect(mockStoreFacade.userLogin).toHaveBeenCalledWith(fakeUser);
  });

  it('should call the handle user signup', () => {
    spyOn(mockStoreFacade, 'createNewUser').and.callThrough();
    const fakeUser = {
      firstName: 'john',
      lastName: 'doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: 'Hunter2@',
    };
    component.handleUserSignup(fakeUser);
    expect(mockStoreFacade.createNewUser).toHaveBeenCalledWith(fakeUser);
  });

  it('should handle if alpaca redirects or not', () => {
    spyOn(component, 'registerWithAlpaca');
    component.hasAlpacaCode = false;
    component.handleAlpacaRedirectResponse(false);
    expect(component.registerWithAlpaca).toHaveBeenCalledTimes(0);
    component.hasAlpacaCode = true;
    component.handleAlpacaRedirectResponse(false);
    expect(component.registerWithAlpaca).toHaveBeenCalledTimes(0);
    component.hasAlpacaCode = true;
    component.handleAlpacaRedirectResponse(true);
    expect(component.registerWithAlpaca).toHaveBeenCalledTimes(0);
    component.hasAlpacaCode = false;
    component.handleAlpacaRedirectResponse(true);
    expect(component.registerWithAlpaca).toHaveBeenCalledTimes(1);
  });

  it('should handle if the user login status changes', () => {
    spyOn(fakeRoute, 'navigate').and.callThrough();
    component.handleLoginRedirect(false);
    expect(fakeRoute.navigate).toHaveBeenCalledTimes(0);
    component.handleLoginRedirect(true);
    expect(fakeRoute.navigate).toHaveBeenCalledTimes(1);
  });

  it('should handle route data', () => {
    spyOn(mockStoreFacade, 'updateUser').and.callThrough();
    component.handleRouteData(null);
    expect(mockStoreFacade.updateUser).toHaveBeenCalledTimes(0);
    component.handleRouteData({ code: '123-456-789' });
    const userParams = {
      id: 0,
      alpacaApiKey: '123-456-789',
    };
    expect(mockStoreFacade.updateUser).toHaveBeenCalledWith(userParams);
  });
});
