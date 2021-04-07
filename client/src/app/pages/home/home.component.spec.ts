import { UserOwnedStockProfileComponent } from './../../components/user-owned-stock-profile/user-owned-stock-profile.component';
import { HomeProfileComponent } from './../../components/home-profile-column/home-profile.component';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderComponent } from '../../components/header/header.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
  FORM_MODULE_DPENDENCEIES,
  TRANSACTION_SERVICE,
} from '../../shared.module';
import { StockSearchComponent } from '../../components/stock-search/stock-search.component';
import { EditProfileComponent } from './../../components/edit-profile/edit-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FollowingsSearchComponent } from 'src/app/components/followings-search/followings-search.component';
import { HomeTimelineComponent } from 'src/app/components/home-timeline/home-timeline.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        HomeComponent,
        HeaderComponent,
        HomeProfileComponent,
        StockSearchComponent,
        EditProfileComponent,
        FollowingsSearchComponent,
        UserOwnedStockProfileComponent,
        HomeTimelineComponent
      ],
      providers: [
        NGRX_STORE_MODULE,
        TRANSACTION_SERVICE,
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
              //testing matdialog
            },
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
