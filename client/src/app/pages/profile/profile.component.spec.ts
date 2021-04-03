import { UserOwnedStockProfileComponent } from './../../components/user-owned-stock-profile/user-owned-stock-profile.component';
import { SectorsPieChartComponent } from './../../components/sector-pie-chart/sector-pie-chart.component';
import { HistoricalChartComponent } from './../../components/historical-chart/historical-chart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../../components/header/header.component';
import { TransactionHistoryComponent } from '../../components/transaction-history/transaction-history.component';
import { ProfileComponent } from './profile.component';
import { StockSearchComponent } from '../../components/stock-search/stock-search.component';
import { ListOfFollowsComponent } from 'src/app/components/list-of-follows/list-of-follows.component';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGRX_STORE_MODULE,
  NGX_ECHART,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { User, UserProfile } from 'src/app/interfaces/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

const mockStoreFacade = {
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
  loadCurrentProfileUser: jest.fn(),
} as any;

const mockUserService = {
  getPortfolioHistoricalData: jest.fn(),
} as any;

const fakeMatDialog = {
  openDialog: jest.fn(),
} as any;

const fakeActivatedRoute = {
  queryParams: of(null),
} as any;

const fakeRoute = {
  navigate: jest.fn(),
} as any;

const fakeDatePipe = {
  transform: jest.fn(),
} as any;

const fakeFollowersList: User[] = [
  {
    id: 1,
    firstName: 'George',
    lastName: 'White',
    username: 'GeorgeWhite',
    score: 50,
  },
  {
    id: 2,
    firstName: 'Jack',
    lastName: 'Daniel',
    username: 'JackDaniel',
    score: 10,
  },
];

const fakeFollowingsList: User[] = [
  {
    id: 3,
    firstName: 'Karim',
    lastName: 'Kamal',
    username: 'KarimKamal',
    score: 60,
  },
  {
    id: 4,
    firstName: 'Ashley',
    lastName: 'Barber',
    username: 'AshleyBarber',
    score: 12,
  },
];

const fakeCompleteUserProfile: UserProfile = {
  coverPhotoURL:
    'https://www.cn.ca/-/media/Images/Stories/2021/20210222-RISE-Employee-Resource-Group-600X400.jpg',
  avatarURL:
    'https://www.cn.ca/-/media/Images/Stories/2021/20210222-RISE-Employee-Resource-Group-600X400.jpg',
  id: 5,
  firstName: 'profileUserFirstname',
  lastName: 'profileUserLastName',
  username: 'profileUserUserName',
  score: 150,
  followers: fakeFollowersList,
  following: fakeFollowingsList,
  biography: 'Here comes the pain train!',
};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        RouterTestingModule,
        NGX_ECHART,
        HttpClientTestingModule,
      ],
      declarations: [
        ProfileComponent,
        HeaderComponent,
        TransactionHistoryComponent,
        StockSearchComponent,
        ListOfFollowsComponent,
        HistoricalChartComponent,
        UserOwnedStockProfileComponent,
        SectorsPieChartComponent
      ],
      providers: [NGRX_STORE_MODULE],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component = new ProfileComponent(
      mockStoreFacade,
      fakeMatDialog,
      fakeActivatedRoute,
      fakeRoute,
      fakeDatePipe,
      mockUserService
    );
    component.completeUserProfile = fakeCompleteUserProfile;
    component.loggedInUserId = 0; // different from UserProfile
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return followers/followings correctly', () => {
    expect(component.getFollowers()).toEqual(fakeFollowersList);
    expect(component.getFollowings()).toEqual(fakeFollowingsList);
  });

  it('should detect if the current user is looking at his/her own profile', () => {
    expect(component.isLoggedInUserProfile()).toBe(false);
    component.loggedInUserId = component.completeUserProfile.id;
    expect(component.isLoggedInUserProfile()).toBe(true);
    component.loggedInUserId = null;
    expect(component.isLoggedInUserProfile()).toEqual(null);
  });

  it('should use the right button label, follow/unfollow based on list of followings', () => {
    expect(component.followButtonLabel()).toEqual('Follow');
    component.loggedInUserId = 1; // an existing id in the followers
    expect(component.followButtonLabel()).toEqual('Unfollow');
  });

  it('should update followers list after calling follow/unfollow', () => {
    const followSpy = jest.spyOn(mockStoreFacade, 'followUser');
    const unfollowSpy = jest.spyOn(mockStoreFacade, 'unfollowUser');
    const loadCurrentProfileUserSpy = jest.spyOn(
      mockStoreFacade,
      'loadCurrentProfileUser'
    );
    component.followOrUnfollow();
    expect(followSpy).toHaveBeenCalled();
    component.loggedInUserId = 1;
    component.followOrUnfollow();
    expect(unfollowSpy).toHaveBeenCalled();
    expect(loadCurrentProfileUserSpy).toHaveBeenCalled();
  });

  it('should print the right message for bio', () => {
    expect(component.bioText()).toEqual('Here comes the pain train!');
    component.completeUserProfile.biography = '';
    expect(component.bioText()).toEqual('This user has no biography yet.');
    component.completeUserProfile.biography = null;
    expect(component.bioText()).toEqual('This user has no biography yet.');
  });
});
