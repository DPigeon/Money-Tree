import { createAction, props } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';

export const loadStockInfo = createAction(
  '[Stock Info] Load Stock Info',
  props<{ stockTicker: string }>()
);

export const stockInfoLoadSuccess = createAction(
  '[Stock Info] Load Stock Info Success',
  props<{ stock: Stock }>()
);

export const createNewUser = createAction(
  '[User] Create new user',
  props<{ user: User }>()
);

export const getCurrentUser = createAction(
  '[User] Get new user',
  props<{ id: number }>()
);

export const userLogin = createAction(
  '[User] User login',
  props<{ user: User }>()
);

export const upadateUser = createAction(
  '[User] Update user',
  props<{ user: User }>()
);

export const setCurrentUser = createAction(
  '[User] New value for current user',
  props<{ user: User }>()
);

export const logCurrentUserOut = createAction('[User] Log user out');

export const setAppError = createAction(
  '[User] App Error',
  props<{ errorMessage: any }>()
);
