import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FollowingsSearchComponent } from './followings-search.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'src/app/interfaces/user';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

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

// unit tests
describe('FollowingsSearchComponent Unit Test', () => {
  let component: FollowingsSearchComponent;
  beforeEach(() => {
    component = new FollowingsSearchComponent(mockRouter);
  });

  it('should display correct searched followings', () => {
    const fakeUser1 = {
      id: 1,
      firstName: 'Razine',
      lastName: 'Bensari',
      score: 180,
    };
    const fakeUser2 = {
      id: 0,
      firstName: 'Marwan',
      lastName: 'Ayadi',
      score: 120,
    };
    component.followingSearch = 'Ra';
    console.log(fakeUser1);
    expect(component.isSearchedFollowings(fakeUser1)).toBe(true);
    expect(component.isSearchedFollowings(fakeUser2)).toBe(false);
    component.followingSearch = '';
    expect(component.isSearchedFollowings(fakeUser2)).toBe(true);
    component.followingSearch = 'marwan ay';
    expect(component.isSearchedFollowings(fakeUser2)).toBe(true);
  });

  it('should navigate to the correct user profile', () => {
    const fakeUser1 = {
      id: 1,
      firstName: 'Razine',
      lastName: 'Bensari',
      score: 180,
    };
    const routingSpy = jest.spyOn(mockRouter, 'navigate');
    component.navigateToFollowingProfile(fakeUser1.id);
    expect(routingSpy).toHaveBeenCalledTimes(1); // to be changed to user id
  });
});
