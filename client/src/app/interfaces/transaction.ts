export interface Transaction {
  symbol: string;
  qty?: number;
  total?: number;
  side?: string; // buy / sell
  type: string; // market / limit
  time_in_force: string;
  status?: string; // This is the status of the order
  averagePricePerShare?: number;
  client_order_id?: string;
}
