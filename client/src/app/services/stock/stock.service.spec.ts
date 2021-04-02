import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Stock } from 'src/app/interfaces/stock';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import yahooSampleChart from 'src/assets/stock-history/yahooSampleChart';
import { DataFormatter } from 'src/app/utilities/data-formatters';

describe('StockService', () => {
  let service: StockService;
  const dataFormatter = new DataFormatter();

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
      industry: 'Travel',
    },
    book: {
      quote: {
        change: 4,
        changePercent: 0.03,
        latestPrice: 16.34,
        open: 100.5,
        high: 200.2,
        low: 516510,
        volume: 151515,
        marketCap: 51651,
        week52High: 455,
        week52Low: 123,
        avgTotalVolume: 199410,
      },
    },
    logo: {
      url: 'sampleurl',
    },
  };

  const expectedStock: Stock = {
    tickerSymbol: iexSampleResponse.company.symbol,
    companyName: iexSampleResponse.company.companyName,
    industry: iexSampleResponse.company.industry,
    volatility: 'low',
    stockChange: iexSampleResponse.book.quote.change,
    stockChangePercent: iexSampleResponse.book.quote.changePercent * 100,
    stockValue: iexSampleResponse.book.quote.latestPrice,
    logo: iexSampleResponse.logo.url,
    stats: {
      open: iexSampleResponse.book.quote.open,
      high: iexSampleResponse.book.quote.high,
      low: iexSampleResponse.book.quote.low,
      volume: iexSampleResponse.book.quote.volume,
      mktCap: iexSampleResponse.book.quote.marketCap,
      stock52weekHigh: iexSampleResponse.book.quote.week52High,
      stock52weekLow: iexSampleResponse.book.quote.week52Low,
      avgVolume: iexSampleResponse.book.quote.avgTotalVolume,
    },
  };

  const yahooSampleResponse = yahooSampleChart;

  const expectedStockHistory: StockHistory = {
    symbol: yahooSampleResponse.chart.result[0].meta.symbol,
    closePrice: yahooSampleResponse.chart.result[0].indicators.quote[0].close,
    timestamp: yahooSampleResponse.chart.result[0].timestamp,
    currency: yahooSampleResponse.chart.result[0].meta.currency,
  };

  it('should convert iex data to frontend model', () => {
    const transformedData = dataFormatter.IEXtoModel(iexSampleResponse);
    expect(transformedData).toEqual(expectedStock);
  });

  it('should convert yahoo data to frontend model', () => {
    const transformedData = dataFormatter.YahooDataToModel(yahooSampleResponse);
    expect(transformedData).toEqual(expectedStockHistory);
  });
});
