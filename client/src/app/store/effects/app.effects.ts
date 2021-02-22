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
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class Effects {
  constructor(
    private actions$: Actions,
    private stockService: StockService,
    private transactionService: TransactionService,
    private userService: UserService,
    private snackBar: MatSnackBar
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
  getStockHistory$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadStockHistoricalData),
      switchMap((action) => {
        return this.stockService.loadStockHistory(action.stockTicker).pipe(
          map((data) => appActions.stockHistoricalDataLoadSuccess({ stockHistoricalData: data })),
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
  loadMarketClock$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadMarketClock),
      switchMap((action) => {
        return this.stockService.loadMarketClock(action.userId).pipe(
          map((data: any) =>
            appActions.loadMarketClockSuccess({
              marketClock: data,
            })
          ),
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
  loadCurrentUserFollowers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadCurrentUserFollowers),
      switchMap((action) => {
        return this.userService.getFollowers(action.id).pipe(
          map((data: any) =>
            appActions.setCurrentFollowers({ userFollowers: data })
          ),
          catchError((err) =>
            of(
              appActions.setAppError({
                errorMessage: this.mirrorError(err),
              })
            )
          )
        );
      })
    )
  );

  loadCurrentUserFollowings$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadCurrentUserFollowings),
      switchMap((action) => {
        return this.userService.getFollowings(action.id).pipe(
          map((data: any) =>
            appActions.setCurrentFollowings({ userFollowings: data })
          ),
          catchError((error) =>
            of(
              appActions.setAppError({
                errorMessage: this.mirrorError(error),
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

  loadUserTransactions$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadUserTransactions),
      switchMap((action) => {
        return this.transactionService.getUserTransactions(action.userId).pipe(
          map((data) => {
            return appActions.updateUserTransactions({ transactions: data });
          }),
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
        return this.transactionService
          .processStockTransaction(action.transaction, action.userId)
          .pipe(
            map((data) => {
              this.snackBar.open('Transaction Successfully Placed', 'Close', {
                duration: 5000,
              });
              // a successful call will return list of transactions for that user
              return appActions.updateUserTransactions({ transactions: data });
            }),
            catchError((data) => {
              this.snackBar.open('Error with Transaction', 'Close', {
                duration: 5000,
              });
              return of(
                appActions.setAppError({
                  errorMessage: this.mirrorError(data),
                })
              );
            })
          );
      })
    )
  );

  loadUserOwnedStocks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadUserOwnedStocks),
      switchMap((action) => {
        return this.stockService.getUserOwnedStocks(action.userId).pipe(
          map((data) => {
            return appActions.updateUserOwnedStocks({ stocks: data });
          }),
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

  loadUserProfile$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadUserProfile),
      switchMap((action) => {
        return this.userService.getUserByUsername(action.username).pipe(
          map((data) => {
            return appActions.setCurrentProfileUser({
              currentProfileUser: data,
            });
          }),
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

  followUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.followUser),
      switchMap((action) => {
        return this.userService
          .followUser(action.followerId, action.userToFollowId)
          .pipe(
            map(() => {
              return appActions.loadCurrentUserFollowings({
                id: action.followerId,
              });
            })
          );
      })
    )
  );

  unfollowUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.unfollowUser),
      switchMap((action) => {
        return this.userService
          .unfollowUser(action.followerId, action.userToUnfollowId)
          .pipe(
            map(() => {
              return appActions.loadCurrentUserFollowings({
                id: action.followerId,
              });
            })
          );
      })
    )
  );

  mirrorError(backendError: any): AppError {
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
