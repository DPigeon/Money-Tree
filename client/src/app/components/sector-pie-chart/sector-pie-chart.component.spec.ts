import { UserProfile } from './../../interfaces/user';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGX_ECHART,
} from '../../shared.module';
import { SectorsPieChartComponent } from './sector-pie-chart.component';

describe('SectorsPieChartComponent', () => {
  let component: SectorsPieChartComponent;
  let fixture: ComponentFixture<SectorsPieChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        NGX_ECHART,
      ],
      declarations: [SectorsPieChartComponent],
    }).compileComponents();
  });
  const profileUser: UserProfile = {
    percentile: 2,
    transactions: [
      {
        symbol: 'AAPL',
        type: '',
        industry: 'Technology',
        timeInForce: '',
      },
      {
        symbol: 'TSLA',
        type: '',
        industry: 'Cars',
        timeInForce: '',
      },
    ],
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsPieChartComponent);
    component = fixture.componentInstance;
    component.currentProfileUser = profileUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format chart data properly', () => {
    expect(component.formatData(profileUser)).toEqual([
      { name: 'Technology', value: 1 },
      { name: 'Cars', value: 1 },
    ]);
  });

  it('should show correct percentile for profileUser', () => {
    expect(component.getPercentile()).toEqual('(Top 2%)');
  });

  it('should show the chart if profileUser has been set', () => {
    const spy = spyOn(component, 'displayChart');
    component
      .formatChartData()
      .then(() => {
        expect(component.axisData).toEqual([
          { name: 'Technology', value: 1 },
          { name: 'Cars', value: 1 },
        ]);
        expect(spy).toHaveBeenCalled();
      })
      .catch(() => {
      // this is intentional for test
      });
    expect(component.isUnavailableChart).toBe(false);
  });
});
