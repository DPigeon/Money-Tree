import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  @Input() userInfo: User;
  transactionHistory: Transaction[];
  constructor() { }

  ngOnInit(): void {
    console.log('Yo my dick', this.userInfo)
    //this.transactionHistory = this.userInfo.transactions;
  }

  printTransaction(transaction: Transaction): string{
    console.log('This is print Transaction ',transaction)
   // let printedTransaction = '';
   // transaction.side === 'buy' ? printedTransaction +='Bought ' : printedTransaction +='Sold '; 
   // printedTransaction += 'shares of ' + transaction.stockFulfilled.tickerSymbol + 'at an average of ' + transaction.averagePricePerShare + ' per share.'; 

   // return transaction ? printedTransaction : '';
   return '';
  }
}
