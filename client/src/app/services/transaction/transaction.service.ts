import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: ApiService, private userService: UserService) {}

  getUserTransactions(userId: number): Observable<Transaction[]> {
    return this.api
      .get('transactions/' + userId)
      .pipe(map((res: Response) => this.transactionListFormatter(res)));
  }

  processStockTransaction(
    transaction: Transaction,
    userId: number
  ): Observable<any> {
    return this.api
      .post('transactions/execute/' + userId, transaction)
      .pipe(map((res: Response) => this.transactionListFormatter(res)));
  }

  transactionListFormatter(response: any): Transaction[] {
    const result: Transaction[] = [];
    for (const fetchedTransaction of response.body) {
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
