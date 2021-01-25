import { Stock } from './stock';

export interface Transaction {
  qty: number;
  status: string; // This is the status of the order
  orderType: string; // This is the type of order
  averagePricePerShare: number;
  stockFulfilled: Stock;
}
