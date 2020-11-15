export interface Stock {
  tickerSymbol: string;
  companyName: string;
  industry: string;
  volatility: string;
  stockChange: number;
  stockChangePercent: number;
  stockValue: number;
  logo: string;
  stats: {
    open: number;
    high: number;
    low: number;
    volume: number;
    mktCap: number;
    wh: number;
    wl: number;
    avgVolume: number;
  };
}
