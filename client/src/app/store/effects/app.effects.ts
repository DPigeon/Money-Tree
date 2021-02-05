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
                errorMessage: this.mirrorError(data),
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
                errorMessage: this.mirrorError(data),
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
        return this.userService.updateUser(action.user.id, action.user).pipe(
          map((data) => appActions.setCurrentUser({ user: data })),
          catchError((data) =>
            of(
              appActions.setAppError({
                errorMessage: this.mirrorError(data),
              })
            )
          )
        );
      })
    )
  );

  getAlpacaOAuthToken$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.getAlpacaOAuthToken),
      switchMap((action) => {
        return this.userService
          .getOAuthAlpacaToken(action.userId, action.alpacaToken)
          .pipe(
            map((data) => appActions.setCurrentUser({ user: data })),
            catchError((data) =>
              of(
                appActions.setAppError({
                  errorMessage: this.mirrorError(data),
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
                errorMessage: this.mirrorError(data),
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
                errorMessage: this.mirrorError(data),
              })
            )
          )
        );
      })
    )
  );

  updatePictureURL$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.updatePictureURL),
      switchMap((action) => {
        return this.userService
          .updatePictureURL(action.id, action.image, action.typeSelection)
          .pipe(
            map((data) => appActions.setCurrentUser({ user: data })),
            catchError((data) =>
              of(
                appActions.setAppError({
                  errorMessage: this.mirrorError(data),
                })
              )
            )
          );
      })
    )
  );

  createStockTransaction$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.processStockTransaction),
      switchMap((action) => {
        return this.transactionService.processStockTransaction(action.transaction, action.userId).pipe(
          map((data) => appActions.setCurrentUser({ user: data })), 
          catchError((data) =>
          of(
            appActions.setAppError({
              errorMessage: this.mirrorError(data),
            })
            )
          )
        );
      })
    )
  );

  mirrorError(backendError): AppError {
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
}
