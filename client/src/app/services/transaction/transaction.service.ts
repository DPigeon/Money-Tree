import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Transaction } from '../../interfaces/transaction';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  constructor(private api: ApiService) {}

  processStockTransaction(transaction: Transaction): Observable<any> {
    // return this.api........
    // this should return a user object with their transactions and their updated balance
    return of(null);
  }

}


