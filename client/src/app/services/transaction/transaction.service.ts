import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  constructor(private api: ApiService) {}

  processStockTransaction(transaction: Transaction, userId: number): Observable<any> {
    return this.api.post('transactions/execute/' + userId, transaction)
    .pipe(map((res: Response) => console.log(res)));
  }

}


