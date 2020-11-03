import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stock } from '../../interfaces/stock';
import { StockDetailHeaderComponent } from './stock-detail-header.component';
import { MATERIAL_MODULE_DEPENDENCIES } from '../../shared.module';

describe('StockDetailHeaderComponent', () => {
  let component: StockDetailHeaderComponent;
  let fixture: ComponentFixture<StockDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [ StockDetailHeaderComponent ]
    })
    .compileComponents();
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
}

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
  })

  it('should display correct stock class', () => {
    component.stockInfo = stockInfo;
    expect(component.stockChangeColor()).toBe('positive-change');
    component.stockInfo.stockChange = -4.00;
    expect(component.stockChangeColor()).toBe('negative-change');
    component.stockInfo = null; 
    expect(component.stockChangeColor()).toBe('');
  })

  it('should display the correct stock presentation format', () =>{
    component.stockInfo = stockInfo;
    component.stockInfo.stockChange = 4.27 //needed otherwise jest rounds down to 4
    let expectedPositiveOutput = '+4.27(1.68%)';
    let expectedNegativeOuput = '-1.32(1.68%)';
    expect(component.stockInfo.stockChange).toBe(4.27)
    expect(component.stockInfoFormatter()).toBe(expectedPositiveOutput);
    component.stockInfo.stockChange = -1.32;
    expect(component.stockInfoFormatter()).toBe(expectedNegativeOuput);
    component.stockInfo = null;
    expect(component.stockInfoFormatter()).toBe('');
  })
})
