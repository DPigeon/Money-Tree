import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfFollowsComponent } from './list-of-follows.component';

describe('ListOfFollowsComponent', () => {
  let component: ListOfFollowsComponent;
  let fixture: ComponentFixture<ListOfFollowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfFollowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfFollowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
