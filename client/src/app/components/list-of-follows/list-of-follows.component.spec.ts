import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListOfFollowsComponent } from './list-of-follows.component';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';
import { User } from 'src/app/interfaces/user';

const fakeFollowsList: User[] = [
  {
    id: 0,
    firstName: 'John',
    lastName: 'Doe',
    username: 'JohnDoe',
    score: 100,
  },
];

describe('ListOfFollowsComponent', () => {
  let component: ListOfFollowsComponent;
  let fixture: ComponentFixture<ListOfFollowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        MatDialogModule,
      ],
      declarations: [ListOfFollowsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: [fakeFollowsList, 'followers'],
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfFollowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.follows = fakeFollowsList;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct emptyListMessage', () => {
    component.follows = [];
    component.listType = 'followers';
    component.username = 'Johnny';
    expect(component.emptyListMessage()).toEqual(
      'Johnny is not followed by any other user!'
    );
    component.listType = 'followings';
    expect(component.emptyListMessage()).toEqual(
      'Johnny is not following any other user!'
    );
  });

  it('should emit the navigation to profile page of another user event', () => {
    spyOn(component.navigateToProfile, 'emit');
    component.navigateToFollowProfile('JohnDoe', '0');
    expect(component.navigateToProfile.emit).toHaveBeenCalledTimes(1);
    expect(component.navigateToProfile.emit).toHaveBeenCalledWith([
      'JohnDoe',
      '0',
    ]);
  });
});
