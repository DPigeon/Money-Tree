import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeProfileComponent } from './home-profile.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';

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
      declarations: [HomeProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// const mockRouter = {
//   navigate: jest.fn(),
// } as any;

// // unit tests
// describe('HomeProfileComponent Unit Test', () => {
//   let component: HomeProfileComponent;
//   beforeEach(() => {
//     component = new HomeProfileComponent(mockRouter);
//   });

//   it('should display correct searched followings', () => {
//     const fakeUser1 = {
//       id: 1,
//       firstName: 'Razine',
//       lastName: 'Bensari',
//       score: 180,
//     };
//     const fakeUser2 = {
//       id: 0,
//       firstName: 'Marwan',
//       lastName: 'Ayadi',
//       score: 120,
//     };
//     component.followingSearch = 'Ra';
//     console.log(fakeUser1);
//     expect(component.isSearchedFollowings(fakeUser1)).toBe(true);
//     expect(component.isSearchedFollowings(fakeUser2)).toBe(false);
//     component.followingSearch = '';
//     expect(component.isSearchedFollowings(fakeUser2)).toBe(true);
//     component.followingSearch = 'marwan ay';
//     expect(component.isSearchedFollowings(fakeUser2)).toBe(true);
//   });

//   it('should navigate to the correct user profile', () => {
//     const fakeUser1 = {
//       id: 1,
//       firstName: 'Razine',
//       lastName: 'Bensari',
//       username: 'username',
//       score: 180,
//     };
//     const routingSpy = jest.spyOn(mockRouter, 'navigate');
//     component.navigateToFollowingProfile(fakeUser1.username);
//     expect(routingSpy).toHaveBeenCalledTimes(1); // to be changed to user id
//   });
// });
