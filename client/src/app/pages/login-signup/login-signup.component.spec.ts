import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginSignupComponent } from './login-signup.component';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { MATERIAL_MODULE_DEPENDENCIES } from '../../shared.module';

describe('LoginSignupComponent', () => {
  let component: LoginSignupComponent;
  let fixture: ComponentFixture<LoginSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [LoginSignupComponent, SignupFormComponent]
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
