import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { StockService } from '../../services/stock/stock.service';
import { TransactionService } from '../../services/transaction/transaction.service';
import { UserService } from '../../services/user/user.service';
import * as appActions from '../actions/app.actions';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class Effects {

  constructor(private actions$: Actions,
    private stockService: StockService,
    private transactionService: TransactionService,
    private userService: UserService) { }

  getStock$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadStockInfo),
      switchMap(action =>{
        return this.stockService.loadStockInfo(action.stockTicker).pipe(
          map((data) => appActions.stockInfoLoadSuccess({stock: data}))
        )
      })
    )
  )

}
