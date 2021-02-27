import { MarketClock } from './../../interfaces/market-clock';
import { createReducer, on } from '@ngrx/store';
import { AppError } from 'src/app/interfaces/app-error';
import { Stock } from 'src/app/interfaces/stock';
import { User } from 'src/app/interfaces/user';
import * as appActions from '../actions/app.actions';

export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
  currentStockLoaded: Stock;
  currentMarketClock: MarketClock;
  errorMessage: AppError;
  followers: User[];
  followings: User[];
}

export const initialState: State = {
  user: null,
  currentStockLoaded: null,
  errorMessage: null,
  currentMarketClock: null,
  followers: null,
  followings: null,
};

export const reducer = createReducer(
  initialState,
  on(appActions.stockInfoLoadSuccess, (state, { stock }) => ({
    ...state,
    currentStockLoaded: stock,
  })),

  on(appActions.loadMarketClockSuccess, (state, { marketClock }) => ({
    ...state,
    currentMarketClock: marketClock,
  })),

  on(appActions.setCurrentUser, (state, { user }) => {
    if (user.id) {
      localStorage.setItem('userId', String(user.id));
    }
    return { ...state, user };
  }),

  on(appActions.setCurrentFollowers, (state, { userFollowers }) => ({
    ...state,
    followers: userFollowers,
  })),

  on(appActions.setCurrentFollowings, (state, { userFollowings }) => ({
    ...state,
    followings: userFollowings,
  })),

  on(appActions.setAppError, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(appActions.logCurrentUserOut, (state) => {
    localStorage.removeItem('userId');
    return { ...state, user: null };
  })
);
