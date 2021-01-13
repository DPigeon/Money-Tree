import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { StockService } from '../../services/stock/stock.service';
import { TransactionService } from '../../services/transaction/transaction.service';
import { UserService } from '../../services/user/user.service';
import * as appActions from '../actions/app.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppError } from 'src/app/interfaces/app-error';

@Injectable()
export class Effects {
  constructor(
    private actions$: Actions,
    private stockService: StockService,
    private transactionService: TransactionService,
    private userService: UserService
  ) {}

  getStock$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadStockInfo),
      switchMap((action) => {
        return this.stockService.loadStockInfo(action.stockTicker).pipe(
          map((data) => appActions.stockInfoLoadSuccess({ stock: data })),
          catchError((data) =>
            of(
              appActions.setAppError({
                errorMessage: mirrorError(data),
              })
            )
          )
        );
      })
    )
  );

  createNewUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.createNewUser),
      switchMap((action) => {
        return this.userService.createNewUser(action.user).pipe(
          map((data) => appActions.setCurrentUser({ user: data })),
          catchError((data) =>
            of(
              appActions.setAppError({
                errorMessage: mirrorError(data),
              })
            )
          )
        );
      })
    )
  );

  updateUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.upadateUser),
      switchMap((action) => {
        // This function will be changed when the backend refactos
        return this.userService
          .updateAlpacaCode(action.user.id, action.user.alpacaApiKey)
          .pipe(
            map((data) => appActions.setCurrentUser({ user: data })),
            catchError((data) =>
              of(
                appActions.setAppError({
                  errorMessage: mirrorError(data),
                })
              )
            )
          );
      })
    )
  );

  getCurrentUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.getCurrentUser),
      switchMap((action) => {
        return this.userService.getUser(action.id).pipe(
          map((data) => appActions.setCurrentUser({ user: data })),
          catchError((data) =>
            of(
              appActions.setAppError({
                errorMessage: mirrorError(data),
              })
            )
          )
        );
      })
    )
  );

  userLogin$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.userLogin),
      switchMap((action) => {
        return this.userService.userLogin(action.user).pipe(
          map((data) => appActions.setCurrentUser({ user: data })),
          catchError((data) =>
            of(
              appActions.setAppError({
                errorMessage: mirrorError(data),
              })
            )
          )
        );
      })
    )
  );
}

function mirrorError(backendError): AppError {
  if (backendError && backendError.error) {
    const errorMessage: AppError = {
      status: backendError.error.status,
      timestamp: backendError.error.timestamp,
      debugMessage: backendError.error.debugMessage,
      message: backendError.error.message,
    };
    return errorMessage;
  }
  return null;
}
