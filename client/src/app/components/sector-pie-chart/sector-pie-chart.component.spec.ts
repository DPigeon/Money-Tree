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

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
