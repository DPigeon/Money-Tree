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

  it('should display correct precision abbreviation', () => {
    component.stockInfo = stockInfo;
    expect(component.setPrecisionAbbreviation(4.2723)).toBe('4.27');
    expect(component.setPrecisionAbbreviation(40000.2723)).toBe('40.27 K');
    expect(component.setPrecisionAbbreviation(4000000.2723)).toBe('4.27 M');
    expect(component.setPrecisionAbbreviation(4000000000.2723)).toBe('4.27 B');
    expect(component.setPrecisionAbbreviation(4000000000000.2723)).toBe(
      '4.27 T'
    );
  });

  it('should display correct stock open stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockOpenPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.open)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockOpenPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.open)
    );
    component.stockInfo.stats.open = stockInfo.stats.open;
    expect(component.stockOpenPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.open)
    );
    component.stockInfo.stats.open = null;
    expect(component.stockOpenPrice).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockOpenPrice).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockOpenPrice).toBe('N/A');
  });

  it('should display correct stock high stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockHighPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.high)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockHighPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.high)
    );
    component.stockInfo.stats.high = stockInfo.stats.high;
    expect(component.stockHighPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.high)
    );
    component.stockInfo.stats.high = null;
    expect(component.stockHighPrice).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockHighPrice).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockHighPrice).toBe('N/A');
  });

  it('should display correct stock low stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockLowPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.low)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockLowPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.low)
    );
    component.stockInfo.stats.low = stockInfo.stats.low;
    expect(component.stockLowPrice).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.low)
    );
    component.stockInfo.stats.low = null;
    expect(component.stockLowPrice).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockLowPrice).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockLowPrice).toBe('N/A');
  });

  it('should display correct stock volume stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.volume)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.volume)
    );
    component.stockInfo.stats.volume = stockInfo.stats.volume;
    expect(component.stockVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.volume)
    );

    component.stockInfo.stats.volume = null;
    expect(component.stockVolume).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockVolume).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockVolume).toBe('N/A');
  });

  it('should display correct stock mktCap stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockMktCap).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.mktCap)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockMktCap).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.mktCap)
    );
    component.stockInfo.stats.mktCap = stockInfo.stats.mktCap;
    expect(component.stockMktCap).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.mktCap)
    );
    component.stockInfo.stats.mktCap = null;
    expect(component.stockMktCap).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockMktCap).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockMktCap).toBe('N/A');
  });

  it('should display correct stock stock52weekLow stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stock52weekLow).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekLow
      )
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stock52weekLow).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekLow
      )
    );
    component.stockInfo.stats.stock52weekLow = stockInfo.stats.stock52weekLow;
    expect(component.stock52weekLow).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekLow
      )
    );
    component.stockInfo.stats.stock52weekLow = null;
    expect(component.stock52weekLow).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stock52weekLow).toBe('N/A');
    component.stockInfo = null;
    expect(component.stock52weekLow).toBe('N/A');
  });

  it('should display correct stock stock52weekHigh stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stock52weekHigh).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekHigh
      )
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stock52weekHigh).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekHigh
      )
    );
    component.stockInfo.stats.stock52weekHigh = stockInfo.stats.stock52weekHigh;
    expect(component.stock52weekHigh).toBe(
      component.setPrecisionAbbreviation(
        component.stockInfo.stats.stock52weekHigh
      )
    );
    component.stockInfo.stats.stock52weekHigh = null;
    expect(component.stock52weekHigh).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stock52weekHigh).toBe('N/A');
    component.stockInfo = null;
    expect(component.stock52weekHigh).toBe('N/A');
  });

  it('should display correct stock avg volume stat', () => {
    component.stockInfo = stockInfo;
    expect(component.stockAvgVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.avgVolume)
    );
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockAvgVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.avgVolume)
    );
    component.stockInfo.stats.avgVolume = stockInfo.stats.avgVolume;
    expect(component.stockAvgVolume).toBe(
      component.setPrecisionAbbreviation(component.stockInfo.stats.avgVolume)
    );
    component.stockInfo.stats.avgVolume = null;
    expect(component.stockAvgVolume).toBe('N/A');
    component.stockInfo.stats = stockInfo.stats;
    expect(component.stockAvgVolume).toBe('N/A');
    component.stockInfo = null;
    expect(component.stockAvgVolume).toBe('N/A');
  });
});
