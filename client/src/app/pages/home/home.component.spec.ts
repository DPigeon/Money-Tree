import { UserService } from 'src/app/services/user/user.service';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderComponent } from '../../components/header/header.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';
import { StockSearchComponent } from '../../components/stock-search/stock-search.component';
import { EditProfileComponent } from './../../components/edit-profile/edit-profile.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockUserService = {} as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        RouterTestingModule,
      ],
      declarations: [
        HomeComponent,
        HeaderComponent,
        StockSearchComponent,
        EditProfileComponent,
      ],
      providers: [
        NGRX_STORE_MODULE,
        { provide: UserService, useValue: mockUserService },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
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
