import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MATERIAL_MODULE_DEPENDENCIES, NGRX_STORE_MODULE } from '../../shared.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [ HomeComponent, HeaderComponent ],
      providers: NGRX_STORE_MODULE
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
