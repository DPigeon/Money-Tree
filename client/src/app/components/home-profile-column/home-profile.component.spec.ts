import { HomeTimelineComponent } from './../home-timeline/home-timeline.component';
import { StockSearchComponent } from 'src/app/components/stock-search/stock-search.component';
import { FollowingsSearchComponent } from 'src/app/components/followings-search/followings-search.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HomeComponent } from './../../pages/home/home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeProfileComponent } from './home-profile.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserOwnedStockProfileComponent } from '../user-owned-stock-profile/user-owned-stock-profile.component';
import { SellOrBuyActionsComponent } from '../sell-buy-stock/sell-buy-actions.component';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { Observable } from 'rxjs';

const mockRouter = {
  navigate: jest.fn(),
} as any;

const mockDialog = {
  open: jest.fn(),
} as any;

const mockStoreFacade = {
  userLogin: jest.fn(),
  createNewUser: jest.fn(),
  updateUser: jest.fn(),
  loadAlpacaPositions: jest.fn(),
} as any;

const fakeUser: User = {
  id: 0,
  firstName: 'userfn',
  lastName: 'userln',
  username: 'username',
};

// integration tests
describe('HomeProfileComponent', () => {
  let component: HomeProfileComponent;
  let fixture: ComponentFixture<HomeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [
        HomeComponent,
        HeaderComponent,
        HomeProfileComponent,
        StockSearchComponent,
        EditProfileComponent,
        FollowingsSearchComponent,
        UserOwnedStockProfileComponent,
        SellOrBuyActionsComponent,
        HomeTimelineComponent,
      ],
      providers: [
        NGRX_STORE_MODULE,
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeProfileComponent);
    component = fixture.componentInstance;
    component.currentUser = fakeUser;
    component.alpacaPositions$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// unit tests
describe('HomeProfileComponent Unit Test', () => {
  let component: HomeProfileComponent;
  beforeEach(() => {
    component = new HomeProfileComponent(
      mockRouter,
      mockStoreFacade,
      mockDialog
    );
  });

  // it('should set User Earnings', () => {
  //   const fakeEarning1 = {
  //     earnings: 1534521.123165,
  //     totalGain: 213.5416516,
  //     positive: true,
  //   };
  //   component.generateEarningsInfo();
  //   expect(component.earningsInfo).toEqual({
  //     earnings: 0,
  //     totalGain: 0,
  //     positive: true,
  //     amount: '1534521.12',
  //     gain: '213.54',
  //     percentage: '0.00',
  //   });
  //   expect(component.getEarningSign(component.earningsInfo.positive)).toBe('+');
  //   expect(component.getEarningsClass(component.earningsInfo.positive)).toBe(
  //     'positive-change'
  //   );

  //   const fakeEarning2 = {
  //     earnings: 1534521.123165,
  //     totalGain: -213.5416516,
  //     positive: true,
  //   };
  //   component.generateEarningsInfo();
  //   expect(component.earningsInfo).toEqual({
  //     amount: '1534521.12',
  //     earnings: 0,
  //     gain: '-213.54',
  //     percentage: '-0.00',
  //     positive: false,
  //     totalGain: 0,
  //   });
  //   expect(component.getEarningSign(component.earningsInfo.positive)).toBe('');
  // because for a negative number the - sign is already there
  //   expect(component.getEarningsClass(component.earningsInfo.positive)).toBe(
  //     'negative-change'
  //   );
  // });
});
