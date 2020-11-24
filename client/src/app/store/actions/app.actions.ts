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

export const createNewUserSuccess = createAction(
  '[User] Create new user success',
  props<{ user: User }>()
);

export const createNewUserFailure = createAction(
  '[User] Create new user failure',
  props<{ errorMessage: any }>()
);
