import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from './shared.module';

const mockStoreFacade = {
  getCurrentUser: jest.fn(),
  authenticationInformation$: {
    subscribe: jest.fn(() => of()),
  },
} as any;

const fakeRoute = {
  navigate: jest.fn(),
} as any;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MATERIAL_MODULE_DEPENDENCIES],
      declarations: [AppComponent, HeaderComponent],
      providers: NGRX_STORE_MODULE,
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('AppComponent Login Logic', () => {
  let component: AppComponent;
  const routeSpy = jest.spyOn(fakeRoute, 'navigate');
  const storeSpy = jest.spyOn(mockStoreFacade, 'getCurrentUser');

  beforeEach(() => {
    component = new AppComponent(mockStoreFacade, fakeRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not do anything if user is logged in', () => {
    component.landingPageNavigator(true, true, 3);
    expect(routeSpy).toHaveBeenCalledTimes(0);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });

  it('should not do anything if user is logged in with no local id', () => {
    component.landingPageNavigator(true, true, null);
    expect(routeSpy).toHaveBeenCalledTimes(0);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });

  it('should navigate to home if no alpaca id', () => {
    component.landingPageNavigator(true, false, 3);
    expect(routeSpy).toHaveBeenCalledTimes(1);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });

  it('should navigate to home if no alpaca id and no user id', () => {
    component.landingPageNavigator(true, false, null);
    expect(routeSpy).toHaveBeenCalledTimes(1);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });

  it('should get the user data if not user exists, but id does', () => {
    component.landingPageNavigator(false, true, 3);
    expect(routeSpy).toHaveBeenCalledTimes(0);
    expect(storeSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate home if no user exists, and id does not', () => {
    component.landingPageNavigator(false, true, null);
    expect(routeSpy).toHaveBeenCalledTimes(1);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });

  it('should get user data if user does not exist and id does (no alpaca)', () => {
    component.landingPageNavigator(false, false, 3);
    expect(routeSpy).toHaveBeenCalledTimes(0);
    expect(storeSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate home if no user exists, and id does not (no alpaca)', () => {
    component.landingPageNavigator(false, false, null);
    expect(routeSpy).toHaveBeenCalledTimes(1);
    expect(storeSpy).toHaveBeenCalledTimes(0);
  });
});
