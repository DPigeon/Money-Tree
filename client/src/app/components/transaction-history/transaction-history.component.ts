import { Component, Input, OnChanges } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';
import { UserProfile } from 'src/app/interfaces/user';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnChanges {
  @Input() currentProfileUser: UserProfile;
  transactions: Transaction[];

  ngOnChanges(): void {
    this.transactions = this.currentProfileUser && this.currentProfileUser.transactions ? this.currentProfileUser.transactions : [];
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
