import { Stock } from './stock';
import { Transaction } from './transaction';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarURL?: string;
  coverPhotoURL?: string;
  email?: string;
  score?: number;
  rank?: number;
  balance?: number;
  password?: string;
  alpacaApiKey?: string;
  biography?: string;
}

export interface UserProfile extends User {
  portfolio?: Stock[];
  transactions?: Transaction[];
  following?: User[];
  followers?: User[];
  percentile?: number;
}
