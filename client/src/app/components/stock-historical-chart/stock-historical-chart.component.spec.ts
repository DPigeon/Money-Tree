import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxEchartsDirective } from 'ngx-echarts';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
  NGX_ECHART,
} from '../../shared.module';
import { StockHistoricalChartComponent } from './stock-historical-chart.component';

describe('StockHistoricalChartComponent', () => {
  let component: StockHistoricalChartComponent;
  let fixture: ComponentFixture<StockHistoricalChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        NGX_ECHART,
      ],
      declarations: [StockHistoricalChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockHistoricalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const stockHistoricalData: StockHistory = {
  symbol: 'TSLA',
  closePrice: [
    689.8787841796875,
    687.1099853515625,
    688.989990234375,
    null,
    696.219970703125,
    691.0900268554688,
  ],
  timestamp: [
    1614781800,
    1614782100,
    1614782400,
    1614782700,
    1614783000,
    1614783300,
  ],
  currency: 'USD',
};
const formatedValues: number[] = [689.88, 687.11, 688.99, null, 696.22, 691.09];

// unit tests
describe('Stock Historical chart', () => {
  let component: StockHistoricalChartComponent;

  beforeEach(() => {
    component = new StockHistoricalChartComponent();
    spyOn(component.changeHistoricalChartRangeInterval, 'emit');
  });

  it('should convert timestamp to Date', () => {
    const d = new Date();
    component.historicalData = stockHistoricalData;
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
    component.selectedRange = '1d' || '5d' || '1mo';
    expect(
      component.convertTimeStampToDate(stockHistoricalData.timestamp)
    ).toEqual(
      stockHistoricalData.timestamp.map(
        (t) =>
          String(months[new Date(t * 1000).getMonth()]) +
          ' ' +
          new Date(t * 1000).getDate() +
          '\n ' +
          String(new Date(t * 1000).getHours()).padStart(2, '0') +
          ':' +
          String(new Date(t * 1000).getMinutes()).padStart(2, '0')
      )
    );
    component.selectedRange = '6mo' || '1y' || '5y' || 'max';
    expect(
      component.convertTimeStampToDate(stockHistoricalData.timestamp)
    ).toEqual(
      stockHistoricalData.timestamp.map(
        (t) =>
          String(months[new Date(t * 1000).getMonth()]) +
          ' ' +
          new Date(t * 1000).getDate() +
          '\n ' +
          new Date(t * 1000).getFullYear()
      )
    );
    
  });

  it('should change time interval', () => {
    component.selectedRange = '1d';
    jest.useFakeTimers();
    component.changeRangeInterval({
      view: '5 days',
      range: '5d',
      interval: '15m',
    });
    jest.advanceTimersByTime(1000);
    expect(
      component.changeHistoricalChartRangeInterval.emit
    ).toHaveBeenCalledWith({ interval: '15m', range: '5d' });
    expect(component.selectedRange).toBe('5d');
  });
  it('should format values and set max, min and interval', () => {
    component.maxValue = stockHistoricalData.closePrice[0];
    component.minValue = stockHistoricalData.closePrice[0];
    expect(
      component.formatValues(stockHistoricalData.closePrice).sort()
    ).toEqual(formatedValues.sort());
    expect(component.maxValue).toBe(697);
    expect(component.minValue).toBe(687);
    expect(component.intervalValue).toBe(1);
  });
  it('should display stock history should have at leat 2 none null points', () => {
    component.historicalData = stockHistoricalData;
    expect(component.isUnavailableChart).toBe(false);
    component.historicalData.closePrice = [10, null, null];
    component.ngOnChanges();
    expect(component.isUnavailableChart).toBe(true);
    component.historicalData.closePrice = [10, null, 20];
    component.ngOnChanges();
    expect(component.isUnavailableChart).toBe(true);
  });
});
