import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  constructor(private api: ApiService) {}

  processStockTransaction(transaction: Transaction, userId: number): Observable<any> {
    return this.api.post('transactions/execute/' + userId, transaction)
    .pipe(map((res: Response) => this.userFormatter(res.body)));
  }

  userFormatter(response: any): User {
    const formattedUser: User = {
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
      follows: response.follows,
      followers: response.followers,
      portfolio: response.portfolio,
      transactions: response.transactions,
      biography: response.biography,
    };
    return formattedUser;
  }

}


