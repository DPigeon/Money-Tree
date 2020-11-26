import { Stock } from './stock';
import { Transaction } from './transaction';

export interface User {
  // for frontend we can have all the properties of user as optional and use them based on where we need them
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
  // follows: User[]; // should this be added to backend?
  followers?: User[];
  portfolio?: Stock[];
  transactions?: Transaction[];
}
