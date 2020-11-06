import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Stock } from 'src/app/interfaces/stock';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StockService);
  });

  // integration test
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const iexSampleResponse = {
    company: {
      symbol: 'AC',
      companyName: 'Air Canada',
      industry: 'Travel'
    },
    book: {
      quote: {
        change: 4,
        changePercent: 0.03,
        latestPrice: 16.34
      }
    },
    logo: {
      url: 'sampleurl'
    }
  }

  const expectedStock: Stock ={
    tickerSymbol: iexSampleResponse.company.symbol,
    companyName: iexSampleResponse.company.companyName,
    industry: iexSampleResponse.company.industry,
    volatility: 'low',
    stockChange: iexSampleResponse.book.quote.change,
    stockChangePercent: iexSampleResponse.book.quote.changePercent *100,
    stockValue: iexSampleResponse.book.quote.latestPrice,
    logo: iexSampleResponse.logo.url,
  }

  it('should convert iex data to frontend model', () =>{
    const transformedData = service.IEXtoModel(iexSampleResponse);
    expect(transformedData).toEqual(expectedStock);
  });
});
