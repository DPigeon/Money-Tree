import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  TRANSACTION_SERVICE,
} from '../../shared.module';

import { HomeTimelineComponent } from './home-timeline.component';

describe('HomeTimelineComponent', () => {
  let component: HomeTimelineComponent;
  let fixture: ComponentFixture<HomeTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [HomeTimelineComponent],
      providers: [TRANSACTION_SERVICE],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTimelineComponent);
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
describe('HomeTimelineComponent Unit Test', () => {
  let component: HomeTimelineComponent;
  beforeEach(() => {
    component = new HomeTimelineComponent(mockRouter);
  });

  it('should navigate to right page based on where user clicks on', () => {
    const routingSpy = jest.spyOn(mockRouter, 'navigate');
    component.navigateTo('user', '10');
    expect(routingSpy).toHaveBeenCalledWith(['/profile/10']);
    component.navigateTo('stockOrAnythingEsle', '10');
    expect(routingSpy).toHaveBeenCalledWith(['/stock-detail/10']);
  });

  it('should show proper string after user Buy/Sell action', () => {
    let actionType = 'BUY';
    const qty = 10;
    const avgPrice = 100;
    expect(component.getFeedLine(actionType, qty, avgPrice)).toEqual([
      'Bought 10 shares of',
      ' stocks at an average of $100 a share.',
    ]);
    actionType = 'anythingElse/SELL';
    expect(component.getFeedLine(actionType, qty, avgPrice)).toEqual([
      'Sold 10 shares of',
      ' stocks at an average of $100 a share.',
    ]);
  });

  it('should show the right time for feed', () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const time = `${twoDaysAgo.getFullYear()}-${
      twoDaysAgo.getMonth() + 1
    }-${twoDaysAgo.getDate()}`;

    expect(component.getFeedTime(time)).toEqual(
      `${
        months[twoDaysAgo.getMonth()]
      } ${twoDaysAgo.getDate()}, ${twoDaysAgo.getFullYear()}`
    );
  });
});
