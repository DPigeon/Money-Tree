import { StockPercentage } from './../../interfaces/stock-percentage';
import { AlpacaUserPosition } from 'src/app/interfaces/alpacaPosition';
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
  portfolioHistoricalDataLoaded:any;
  currentMarketClock: MarketClock;
  errorMessage: AppError;
  followers: User[];
  followings: User[];
  userTransactions: Transaction[];
  userOwnedStocks: Stock[];
  searchUserList: UserSearch[];
  leaderboardUsers: User[];
  alpacaPositions: AlpacaUserPosition[];
  topInvestorsOnAStock: User[];
  followersWithSameStock: User[];
  stocksOwnedByUsersOwnThisStock: StockPercentage[]; // the array of [stockSymbol, percentages]
}

export const initialState: State = {
  user: null,
  currentProfileUser: null,
  currentStockLoaded: null,
  stockHistoricalDataLoaded: null,
  portfolioHistoricalDataLoaded:null,
  errorMessage: null,
  currentMarketClock: null,
  followers: null,
  followings: null,
  userTransactions: null,
  userOwnedStocks: null,
  searchUserList: null,
  leaderboardUsers: null,
  alpacaPositions: null,
  topInvestorsOnAStock: null,
  followersWithSameStock: null,
  stocksOwnedByUsersOwnThisStock: null,
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
  on(
    appActions.portfolioHistoricalDataLoadSuccess,
    (state, { portfolioHistoricalData }) => ({
      ...state,
      portfolioHistoricalDataLoaded: portfolioHistoricalData,
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

  on(
    appActions.setCurrentLeaderboardUsers,
    (state, { currentLeaderboardUsers }) => ({
      ...state,
      leaderboardUsers: currentLeaderboardUsers,
    })
  ),

  on(
    appActions.setCurrentAlpacaPositions,
    (state, { currentAlpacaPositions }) => ({
      ...state,
      alpacaPositions: currentAlpacaPositions,
    })
  ),

  on(
    appActions.setTopInvestorsOnAStock,
    (state, { currentTopInvestorsOnAStock }) => ({
      ...state,
      topInvestorsOnAStock: currentTopInvestorsOnAStock,
    })
  ),

  on(
    appActions.setFollowersWithSameStock,
    (state, { currentFollowersWithSameStock }) => ({
      ...state,
      followersWithSameStock: currentFollowersWithSameStock,
    })
  ),

  on(
    appActions.setStocksOwnedByUsersOwnThisStock,
    (state, { currentStocksOwnedByUsersOwnThisStock }) => ({
      ...state,
      stocksOwnedByUsersOwnThisStock: currentStocksOwnedByUsersOwnThisStock,
    })
  )
);
