export interface StockHistory {
  symbol: string;
  closePrice: number[];
  timestamp: number[];
  currency?: string;
}
