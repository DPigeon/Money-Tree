 import { createAction, props } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';

export const loadActionss = createAction(
  '[Actions] Load Actionss'
);

export const loadActionssSuccess = createAction(
  '[Actions] Load Actionss Success',
  props<{ data: any }>()
);

export const loadActionssFailure = createAction(
  '[Actions] Load Actionss Failure',
  props<{ error: any }>()
);

export const loadStockInfo = createAction(
  '[Stock Info] Load Stock Info',
  props<{ stockTicker: string }>()
)

export const stockInfoLoadSuccess = createAction(
  '[Stock Info] Load Stock Info Success',
  props<{ stock: Stock }>()
)