import { createReducer, on } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import * as appActions from '../actions/app.actions';

export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
  currentStockLoaded: Stock;
}

export const initialState: State = {
  user: null,
  currentStockLoaded: null,
};

export const reducer = createReducer(
  initialState,
  on(appActions.stockInfoLoadSuccess, (state, {stock}) => ({...state, currentStockLoaded: stock}))
);

