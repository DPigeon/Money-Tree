import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOwnedStockProfileComponent } from './user-owned-stock-profile.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
  USER_SERVICE,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// integration tests
describe('UserOwnedStockProfileComponent', () => {
  let component: UserOwnedStockProfileComponent;
  let fixture: ComponentFixture<UserOwnedStockProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
        HttpClientTestingModule,
      ],
      declarations: [UserOwnedStockProfileComponent],
      providers: [
        NGRX_STORE_MODULE,
        USER_SERVICE,
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
    fixture = TestBed.createComponent(UserOwnedStockProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const mockRouter = {
  navigate: jest.fn(),
} as any;
const mockUserService = {
  getUserAlpacaPosition: jest.fn(),
} as any;

// unit tests
describe('UserOwnedStockProfileComponent Unit Test', () => {
  let component: UserOwnedStockProfileComponent;
  beforeEach(() => {
    component = new UserOwnedStockProfileComponent(mockRouter, mockUserService);
  });
});
