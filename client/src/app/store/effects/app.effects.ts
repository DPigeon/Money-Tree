import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { StockService } from '../../services/stock/stock.service';
import { TransactionService } from '../../services/transaction/transaction.service';
import { UserService } from '../../services/user/user.service';



@Injectable()
export class Effects {



  constructor(private actions$: Actions,
              private stockService: StockService,
              private transactionService: TransactionService,
              private userService: UserService) {}

}
