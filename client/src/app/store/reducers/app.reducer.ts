import { createReducer, on } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import * as appActions from '../actions/app.actions';

export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
  currentStockLoaded: Stock;
  errorMessage: any; // to be modified
}

export const initialState: State = {
  user: null,
  currentStockLoaded: null,
  errorMessage: null
};

export const reducer = createReducer(
  initialState,
  on(appActions.stockInfoLoadSuccess, (state, {stock}) => ({...state, currentStockLoaded: stock})),
  on(appActions.setUser, (state, {user}) => ({...state, user: user})),
  on(appActions.setAppError, (state, {errorMessage}) => ({...state, errorMessage: errorMessage})),
);
