export interface Stock {
  tickerSymbol: string;
  companyName: string;
  industry?: string;
  volatility?: string;
  stockChange?: number;
  stockChangePercent?: number;
  stockValue?: number;
  logo?: string;
  since?: string;
  quantity?: string;
  avgPrice?: string;
  total?: string;

  stats?: {
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
    mktCap?: number;
    stock52weekHigh?: number;
    stock52weekLow?: number;
    avgVolume?: number;
  };
}
