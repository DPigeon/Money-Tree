import { Stock } from './stock';
import { Transaction } from './transaction';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  email?: string;
  score?: number;
  rank?: number;
  balance?: number;
  password?: string;
  alpacaApiKey?: string;
  biography?: string;
  follows?: User[];
  followers?: User[];
  portfolio?: Stock[];
  transactions?: Transaction[];
}
