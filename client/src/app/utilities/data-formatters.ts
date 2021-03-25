import { User, UserProfile } from 'src/app/interfaces/user';
import { Injectable } from '@angular/core';
import { Transaction } from '../interfaces/transaction';
import { UserSearch } from '../interfaces/userSearch';

@Injectable({
  providedIn: 'root',
})
export class DataFormatter {
  constructor() {
    // is empty
  }

  userFormatter(response: any): User {
    let formattedUser: User;
    return (formattedUser = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      avatarURL: response.avatarURL,
      coverPhotoURL: response.coverPhotoURL,
      email: response.email,
      score: response.score,
      rank: response.rank,
      balance: response.balance,
      alpacaApiKey: response.alpacaApiKey,
      biography: response.biography,
    });
  }

  userCompleteProfileFormatter(response: any): UserProfile {
    const user: UserProfile = this.userFormatter(response);
    user.followers = response.followers;
    user.following = response.following;
    user.transactions = this.transactionListFormatter(response.transactions);
    user.portfolio = response.ownedStocks;
    return user;
  }
  userListFormatter(response: any): User[] {
    const result: User[] = [];
    for (const fetchedUser of response.body) {
      result.push({
        id: fetchedUser.id,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        username: fetchedUser.username,
        avatarURL: fetchedUser.avatarURL,
        score: fetchedUser.score,
        rank: fetchedUser.rank,
        balance: fetchedUser.balance,
      });
    }
    return result;
  }

  userSearchFormatter(response: any): UserSearch[] {
    const result: UserSearch[] = [];
    response.forEach((e) => {
      result.push({
        id: e.username,
        firstName: e.firstName,
        lastName: e.lastName,
        avatarURL: e.avatarURL,
        email: e.email,
      });
    });
    return result;
  }

  transactionListFormatter(response: any): Transaction[] {
    const result: Transaction[] = [];
    for (const fetchedTransaction of response) {
      result.push({
        qty: fetchedTransaction.quantity,
        time_in_force: fetchedTransaction.purchasedAt,
        type: fetchedTransaction.moneyTreeOrderType,
        client_order_id: fetchedTransaction.clienOrderId,
        status: fetchedTransaction.status,
        averagePricePerShare: fetchedTransaction.avgPrice,
        symbol: fetchedTransaction.symbol,
        total: fetchedTransaction.total,
      });
    }
    return result;
  }
}
