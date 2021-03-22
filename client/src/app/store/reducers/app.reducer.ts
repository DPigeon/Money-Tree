import { Transaction } from './../../interfaces/transaction';
import { MarketClock } from './../../interfaces/market-clock';
import { createReducer, on } from '@ngrx/store';
import { AppError } from 'src/app/interfaces/app-error';
import { Stock } from 'src/app/interfaces/stock';
import { User, UserProfile } from 'src/app/interfaces/user';
import * as appActions from '../actions/app.actions';
import { UserSearch } from 'src/app/interfaces/userSearch';

export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
  currentProfileUser: UserProfile;
  currentStockLoaded: Stock;
  stockHistoricalDataLoaded: any;
  currentMarketClock: MarketClock;
  errorMessage: AppError;
  followers: User[];
  followings: User[];
  userTransactions: Transaction[];
  userOwnedStocks: Stock[];
  searchUserList: UserSearch[];
}

export const initialState: State = {
  user: null,
  currentProfileUser: null,
  currentStockLoaded: null,
  stockHistoricalDataLoaded: null,
  errorMessage: null,
  currentMarketClock: null,
  followers: null,
  followings: null,
  userTransactions: null,
  userOwnedStocks: null,
  searchUserList: null,
};

export const reducer = createReducer(
  initialState,
  on(appActions.stockInfoLoadSuccess, (state, { stock }) => ({
    ...state,
    currentStockLoaded: stock,
  })),
  on(
    appActions.stockHistoricalDataLoadSuccess,
    (state, { stockHistoricalData }) => ({
      ...state,
      stockHistoricalDataLoaded: stockHistoricalData,
    })
  ),
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

  on(appActions.updateUserTransactions, (state, { transactions }) => ({
    ...state,
    userTransactions: transactions,
  })),

  on(appActions.updateUserOwnedStocks, (state, { stocks }) => ({
    ...state,
    userOwnedStocks: stocks,
  })),

  on(appActions.loadUserSearchListSuccess, (state, { userSearchList }) => ({
    ...state,
    searchUserList: userSearchList,
  })),

  on(appActions.setAppError, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),

  on(appActions.logCurrentUserOut, (state) => {
    localStorage.removeItem('userId');
    return { ...state, user: null };
  }),

  on(appActions.setCurrentProfileUser, (state, { currentProfileUser }) => {
    return { ...state, currentProfileUser };
  }),
);
