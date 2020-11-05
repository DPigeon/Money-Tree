import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from '../../interfaces/stock';
import { StockDetailHeaderComponent } from './stock-detail-header.component';
import { MATERIAL_MODULE_DEPENDENCIES } from '../../shared.module';

// integration tests
describe('StockDetailHeaderComponent', () => {
  let component: StockDetailHeaderComponent;
  let fixture: ComponentFixture<StockDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [StockDetailHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailHeaderComponent);
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
  logo: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0021/6847/brand.gif?itok=u0iVoArk'
};

// unit tests
describe('StockDetailHeader', () => {
  let component: StockDetailHeaderComponent;

  beforeEach(() => {
    component = new StockDetailHeaderComponent();
  });

  it('should display correct stock values', () => {
    component.stockInfo = stockInfo;
    expect(component.stockValue).toBe(component.stockInfo.stockValue);
    component.stockInfo = null;
    expect(component.stockValue).toBe(0);
  });

  it('should display correct stock class', () => {
    component.stockInfo = stockInfo;
    expect(component.stockChangeColor()).toBe('positive-change');
    component.stockInfo.stockChange = -4.0;
    expect(component.stockChangeColor()).toBe('negative-change');
    component.stockInfo.stockChange = 0;
    expect(component.stockChangeColor()).toBe('');
    component.stockInfo = null;
    expect(component.stockChangeColor()).toBe('');
  });

  it('should display the correct stock presentation format', () => {
    component.stockInfo = stockInfo;
    component.stockInfo.stockChange = 4.27; // needed otherwise jest rounds down to 4
    const expectedPositiveOutput = '+4.27 (1.68%)';
    const expectedNegativeOuput = '-1.32 (1.68%)';
    const expectedZeroOutput = '0 (0.00%)';
    expect(component.stockInfoFormatter()).toBe(expectedPositiveOutput);
    component.stockInfo.stockChange = -1.32;
    expect(component.stockInfoFormatter()).toBe(expectedNegativeOuput);
    component.stockInfo.stockChangePercent = 0;
    component.stockInfo.stockChange = 0;
    expect(component.stockInfoFormatter()).toBe(expectedZeroOutput);
    component.stockInfo = null;
    expect(component.stockInfoFormatter()).toBe('');
  });
});
