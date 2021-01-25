import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MATERIAL_MODULE_DEPENDENCIES, NGRX_STORE_MODULE, FORM_MODULE_DPENDENCEIES } from '../../shared.module';
import { StockSearchComponent } from '../../components/stock-search/stock-search.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES, RouterTestingModule],
      declarations: [ HomeComponent, HeaderComponent, StockSearchComponent ],
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
