import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from '../../interfaces/stock';
import { MATERIAL_MODULE_DEPENDENCIES } from '../../shared.module';
import { StockStatsComponent } from './stock-stats.component';

// integration tests
describe('StockStatsComponent', () => {
  let component: StockStatsComponent;
  let fixture: ComponentFixture<StockStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [StockStatsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const stockInfo: Stock = {
  tickerSymbol: 'AC',
  companyName: 'Air Canada',
  industry: 'Transportation',
  volatility: 'High',
  stockChange: 4.27,
  stockChangePercent: 1.68,
  stockValue: 16.36,
  logo:
    'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0021/6847/brand.gif?itok=u0iVoArk',
  stats: {
    open: 100.5,
    high: 200.2,
    low: 516510,
    volume: 151515,
    mktCap: 51651,
    stock52weekHigh: 455,
    stock52weekLow: 123,
    avgVolume: 199410,
  },
};

// unit tests
describe('StockStats', () => {
  let component: StockStatsComponent;

  beforeEach(() => {
    component = new StockStatsComponent();
  });

  it('should display correct stock open stat', () => {
    component.stockInfo = stockInfo;
    expect(component.open).toBe(component.stockInfo.stats.open.toFixed(2));
    component.stockInfo.stats.open = stockInfo.stats.open;
    expect(component.open).toBe(component.stockInfo.stats.open.toFixed(2));
    component.stockInfo.stats.open = null;
    expect(component.open).toBe('');
    component.stockInfo = null;
    expect(component.open).toBe('');
  });

  it('should display correct stock high stat', () => {
    component.stockInfo = stockInfo;
    expect(component.high).toBe(component.stockInfo.stats.high.toFixed(2));
    component.stockInfo.stats.high = stockInfo.stats.high;
    expect(component.high).toBe(component.stockInfo.stats.high.toFixed(2));
    component.stockInfo.stats.high = null;
    expect(component.high).toBe('');
    component.stockInfo = null;
    expect(component.high).toBe('');
  });

  it('should display correct stock low stat', () => {
    component.stockInfo = stockInfo;
    expect(component.low).toBe(component.stockInfo.stats.low.toFixed(2));
    component.stockInfo.stats.low = stockInfo.stats.low;
    expect(component.low).toBe(component.stockInfo.stats.low.toFixed(2));
    component.stockInfo.stats.low = null;
    expect(component.low).toBe('');
    component.stockInfo = null;
    expect(component.low).toBe('');
  });

  it('should display correct stock volume stat', () => {
    component.stockInfo = stockInfo;
    expect(component.volume).toBe(
      component.stockInfo.stats.volume.toPrecision(3)
    );
    component.stockInfo.stats.volume = stockInfo.stats.volume;
    expect(component.volume).toBe(
      component.stockInfo.stats.volume.toPrecision(3)
    );
    component.stockInfo.stats.volume = null;
    expect(component.volume).toBe('');
    component.stockInfo = null;
    expect(component.volume).toBe('');
  });

  it('should display correct stock mktCap stat', () => {
    component.stockInfo = stockInfo;
    expect(component.mktCap).toBe(component.stockInfo.stats.mktCap.toFixed(2));
    component.stockInfo.stats.mktCap = stockInfo.stats.mktCap;
    expect(component.mktCap).toBe(component.stockInfo.stats.mktCap.toFixed(2));
    component.stockInfo.stats.mktCap = null;
    expect(component.mktCap).toBe('');
    component.stockInfo = null;
    expect(component.mktCap).toBe('');
  });

  it('should display correct stock stock52weekLow stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stock52weekLow).toBe(component.stockInfo.stats.stock52weekLow.toFixed(2));
    component.stockInfo.stats.stock52weekLow = stockInfo.stats.stock52weekLow;
    expect(component.stock52weekLow).toBe(component.stockInfo.stats.stock52weekLow.toFixed(2));
    component.stockInfo.stats.stock52weekLow = null;
    expect(component.stock52weekLow).toBe('');
    component.stockInfo = null;
    expect(component.stock52weekLow).toBe('');
  });

  it('should display correct stock stock52weekHigh stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stock52weekHigh).toBe(component.stockInfo.stats.stock52weekHigh.toFixed(2));
    component.stockInfo.stats.stock52weekHigh = stockInfo.stats.stock52weekHigh;
    expect(component.stock52weekHigh).toBe(component.stockInfo.stats.stock52weekHigh.toFixed(2));
    component.stockInfo.stats.stock52weekHigh = null;
    expect(component.stock52weekHigh).toBe('');
    component.stockInfo = null;
    expect(component.stock52weekHigh).toBe('');
  });

  it('should display correct stock avg volume stat', () => {
    component.stockInfo = stockInfo;
    expect(component.avgVolume).toBe(
      component.stockInfo.stats.avgVolume.toPrecision(3)
    );
    component.stockInfo.stats.avgVolume = stockInfo.stats.avgVolume;
    expect(component.avgVolume).toBe(
      component.stockInfo.stats.avgVolume.toPrecision(3)
    );
    component.stockInfo.stats.avgVolume = null;
    expect(component.avgVolume).toBe('');
    component.stockInfo = null;
    expect(component.avgVolume).toBe('');
  });
});