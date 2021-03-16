import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { dataFormatter } from '../../utilities/data-formatters'

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: ApiService, private userService: UserService, private dataFormatter: dataFormatter) {}

  getUserTransactions(userId: number): Observable<Transaction[]> {
    return this.api
      .get('transactions/' + userId)
      .pipe(map((res: Response) => this.dataFormatter.transactionListFormatter(res)));
  }

  processStockTransaction(
    transaction: Transaction,
    userId: number
  ): Observable<any> {
    return this.api
      .post('transactions/execute/' + userId, transaction)
      .pipe(map((res: Response) => this.dataFormatter.transactionListFormatter(res)));
  }

}
