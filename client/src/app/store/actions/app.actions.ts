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


export const userLogin = createAction(
  '[User] User login',
  props<{ user: User }>()
);

export const userLoginSuccess = createAction(
  '[User] User login success',
  props<{ user: User }>()
);

export const userLoginFailure = createAction(
  '[User] User login failure',
  props<{ errorMessage: any }>()
);
