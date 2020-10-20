import { Stock } from './stock';
import { Transaction } from './transaction';

export interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePicture: string;
    score: number;
    availableBalance: number;
    follows: User[];
    followers: User[];
    portfolio: Stock[];
    transactionsMade: Transaction[];
}
