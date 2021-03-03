import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';
import { StockHistoricalChartComponent } from './stock-historical-chart.component';

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
const convertedTimestamps = [
  'Mar 3\n 09:30',
  'Mar 3\n 09:35',
  'Mar 3\n 09:40',
  'Mar 3\n 09:45',
  'Mar 3\n 09:50',
  'Mar 3\n 09:55',
];
const formatedValues: number[] = [689.88, 687.11, 688.99, null, 696.22, 691.09];
describe('StockHistoricalChartComponent', () => {
  let component: StockHistoricalChartComponent;
  let fixture: ComponentFixture<StockHistoricalChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
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
// unit tests
describe('StockStats', () => {
  let component: StockHistoricalChartComponent;

  beforeEach(() => {
    component = new StockHistoricalChartComponent();
    spyOn(component.changeHistoricalChartRangeInterval, 'emit');
  });

  it('should convert timestamp to Date', () => {
    component.historicalData = stockHistoricalData;
    expect(
      component.convertTimeStampToDate(stockHistoricalData.timestamp).sort()
    ).toEqual(convertedTimestamps.sort());
    component.convertTimeStampToDate(stockHistoricalData.timestamp);
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
