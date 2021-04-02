import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { DataFormatter } from '../../utilities/data-formatters';
import { TimelineFeed } from 'src/app/interfaces/timelineFeed';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: ApiService, private userService: UserService, private dataFormatter: DataFormatter) {}

  getUserTransactions(userId: number): Observable<Transaction[]> {
    return this.api
      .get('transactions/' + userId)
      .pipe(map((res: Response) => this.dataFormatter.transactionListFormatter(res.body)));
  }

  processStockTransaction(
    transaction: Transaction,
    userId: number
  ): Observable<any> {
    return this.api
      .post('transactions/execute/' + userId, transaction)
      .pipe(map((res: Response) => this.dataFormatter.transactionListFormatter(res.body)));
  }
  getTimelineFeed(
    userId: number
  ): Observable<TimelineFeed[]> {
    return this.api
      .get('users/'+userId+'/timeline')
      .pipe(map((res: Response) => this.dataFormatter.timelineFormatter(res.body)));
  }

}
