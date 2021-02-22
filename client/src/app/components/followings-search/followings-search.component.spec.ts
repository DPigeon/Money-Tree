import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowingsSearchComponent } from './followings-search.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';

// integration tests
describe('FollowingsSearchComponent', () => {
  let component: FollowingsSearchComponent;
  let fixture: ComponentFixture<FollowingsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [FollowingsSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingsSearchComponent);
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

const followings = [
  { firstName: 'Marwan', lastName: 'Ayadi' },
  { firstName: 'Razine', lastName: 'Bensari' },
  { firstName: 'Arthur', lastName: 'Tourneyrie' },
  { firstName: 'Alessandro', lastName: 'Kreslin' },
  { firstName: 'David ', lastName: 'Pigeon' },
  { firstName: 'Abdulrahim', lastName: 'Mansour' },
  { firstName: 'Walter', lastName: 'Fleury' },
  { firstName: 'Hossein', lastName: 'Noor' },
  { firstName: 'Lindsay', lastName: 'Bangs' },
];

// unit tests
describe('FollowingsSearchComponent Unit Test', () => {
  let component: FollowingsSearchComponent;

  beforeEach(() => {
    component = new FollowingsSearchComponent(mockRouter);
  });

  it('should display followings list', () => {
    component.followings = followings;
    expect(component.followings).toBeTruthy();
    component.followings = [];
    expect(component.followings.length).toBe(0);
  });

  it('should display correct searched followings', () => {
    component.followingSearch = 'Ra';
    let following = { firstName: 'Razine', lastName: 'Bensari' };
    expect(component.isSearchedFollowings(following)).toBe(true);
    following = { firstName: 'Abdulrahim', lastName: 'Mansour' };
    expect(component.isSearchedFollowings(following)).toBe(true);
    component.followingSearch = '';
    expect(component.isSearchedFollowings(following)).toBe(true);
    component.followingSearch = 'me';
    expect(component.isSearchedFollowings(following)).toBe(false);
  });

  it('should navigate to the correct user profile', () => {
    const routingSpy = jest.spyOn(mockRouter, 'navigate');
    const following = { firstName: 'Razine', lastName: 'Bensari' };
    component.navigateToFollowingProfile(following.firstName);
    expect(routingSpy).toHaveBeenCalledTimes(1); // to be changed to user id
  });
});
