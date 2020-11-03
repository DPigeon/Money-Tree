import { createAction, props } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';

export const loadStockInfo = createAction(
  '[Stock Info] Load Stock Info',
  props<{ stockTicker: string }>()
)

export const stockInfoLoadSuccess = createAction(
  '[Stock Info] Load Stock Info Success',
  props<{ stock: Stock }>()
)