import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeProfileComponent } from './home-profile.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      providers: [
        NGRX_STORE_MODULE,
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
    fixture = TestBed.createComponent(HomeProfileComponent);
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

const mockDialog = {
  open: jest.fn(),
} as any;

const mockStoreFacade = {
  updatePictureURL: jest.fn(),
  loadUserTransactions: jest.fn(),
  updateUser: jest.fn(),
} as any;
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

  it('should set User Earnings', () => {
    const fakeEarning1 = {
      earnings: 1534521.123165,
      totalGain: 213.5416516,
      positive: true,
    };
    component.setEarnings(fakeEarning1);
    expect(component.earnings).toEqual({
      amount: '1534521.12',
      gain: '213.54',
      percentage: '0.00',
      positive: true,
    });
    expect(component.getEarningSign(component.earnings.positive)).toBe('+');
    expect(component.getEarningsClass(component.earnings.positive)).toBe(
      'positive-change'
    );

    const fakeEarning2 = {
      earnings: 1534521.123165,
      totalGain: 213.5416516,
      positive: false,
    };
    component.setEarnings(fakeEarning2);
    expect(component.earnings).toEqual({
      amount: '1534521.12',
      gain: '213.54',
      percentage: '0.00',
      positive: false,
    });
    expect(component.getEarningSign(component.earnings.positive)).toBe('-');
    expect(component.getEarningsClass(component.earnings.positive)).toBe(
      'negative-change'
    );
  });
});
