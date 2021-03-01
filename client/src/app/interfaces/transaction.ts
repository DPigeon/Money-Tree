import { Stock } from './stock';

export interface Transaction {
  symbol: string;
  qty?: number;
  side?: string; // buy / sell
  type: string; // market / limit
  time_in_force: string;
  status?: string; // This is the status of the order
  averagePricePerShare?: number;
  client_order_id?: string;
}
