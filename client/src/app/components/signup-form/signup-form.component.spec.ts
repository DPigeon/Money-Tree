import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupFormComponent } from './signup-form.component';
import { MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES, NGRX_STORE_MODULE } from '../../shared.module';

// integration test
describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [ SignupFormComponent ],
      providers: NGRX_STORE_MODULE
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
