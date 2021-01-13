import { createReducer, on } from '@ngrx/store';
import { AppError } from 'src/app/interfaces/app-error';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import * as appActions from '../actions/app.actions';

export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
  currentStockLoaded: Stock;
  errorMessage: AppError;
}

export const initialState: State = {
  user: null,
  currentStockLoaded: null,
  errorMessage: null,
};

export const reducer = createReducer(
  initialState,
  on(appActions.stockInfoLoadSuccess, (state, { stock }) => ({
    ...state,
    currentStockLoaded: stock,
  })),
  on(appActions.setCurrentUser, (state, { user }) => {
    if (user.id) {
      localStorage.setItem('userId', String(user.id));
    }
    return { ...state, user };
  }),
  on(appActions.setAppError, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(appActions.logCurrentUserOut, (state) => {
    localStorage.removeItem('userId');
    return { ...state, user: null };
  })
);
