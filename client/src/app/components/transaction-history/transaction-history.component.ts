import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit, OnChanges {
  @Input() userTransactions: Transaction[];
  transactionHistory: Transaction[];
  constructor() { }

  ngOnInit(): void {
    if (this.userTransactions) { this.transactionHistory = this.userTransactions; }
    console.log('Transaction history: ', this.transactionHistory);
  }
  ngOnChanges(): void {
    // if (this.userTransactions) { this.transactionHistory = this.userTransactions; }
    // console.log('Transaction history: ', this.transactionHistory);
  }
  transactionFormatStart(transaction: Transaction): string {
    let printedTransaction = '';
    if (transaction) {
      transaction.type === 'MARKET_BUY' ? printedTransaction += 'Bought ' : printedTransaction += 'Sold ';
      printedTransaction += transaction.qty + ' shares of ';
    }
    return transaction ? printedTransaction : 'err';
  }

  transactionFormatEnd(transaction: Transaction): string {
    return transaction ? (' at an average of ' + transaction.averagePricePerShare + '$ per share.') : 'err';
  }

}
