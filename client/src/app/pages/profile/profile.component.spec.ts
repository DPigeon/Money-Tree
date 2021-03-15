import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../../components/header/header.component';
import { TransactionHistoryComponent } from '../../components/transaction-history/transaction-history.component';
import { ProfileComponent } from './profile.component';
import { StockSearchComponent } from '../../components/stock-search/stock-search.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        RouterTestingModule,
      ],
      declarations: [ProfileComponent,
        HeaderComponent,
        TransactionHistoryComponent,
        StockSearchComponent,
      ],
      providers: [
        NGRX_STORE_MODULE,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
