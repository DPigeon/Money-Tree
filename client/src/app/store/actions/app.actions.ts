import { createAction, props } from '@ngrx/store';
import { Stock } from 'src/app/interfaces/stock';
import { User, UserProfile } from 'src/app/interfaces/user';
import { AppError } from 'src/app/interfaces/app-error';
import { MarketClock } from 'src/app/interfaces/market-clock';
import { Transaction } from 'src/app/interfaces/transaction';
import { StockHistory } from 'src/app/interfaces/stockHistory';
import { UserSearch } from 'src/app/interfaces/userSearch';

export const loadStockInfo = createAction(
  '[Stock Info] Load Stock Info',
  props<{ stockTicker: string }>()
);

export const stockInfoLoadSuccess = createAction(
  '[Stock Info] Load Stock Info Success',
  props<{ stock: Stock }>()
);

export const loadStockHistoricalData = createAction(
  '[Stock History] Load Stock Historical Data',
  props<{ stockTicker: string; chartRange: string; chartInterval: string }>()
);

export const stockHistoricalDataLoadSuccess = createAction(
  '[Stock History] Load Stock Historical Data Success',
  props<{ stockHistoricalData: StockHistory }>()
);

export const loadMarketClock = createAction(
  '[Market Clock] Load Market Clock Info',
  props<{ userId: number }>()
);
export const loadMarketClockSuccess = createAction(
  '[Market Clock] Load Market Clock Success',
  props<{ marketClock: MarketClock }>()
);

export const createNewUser = createAction(
  '[User] Create new user',
  props<{ user: User }>()
);

export const getCurrentUser = createAction(
  '[User] Get new user',
  props<{ id: number }>()
);

export const loadCurrentUserFollowers = createAction(
  '[User[]] Load user followers',
  props<{ id: number }>()
);
export const loadCurrentUserFollowings = createAction(
  '[User[]] Load user followings',
  props<{ id: number }>()
);

export const userLogin = createAction(
  '[User] User login',
  props<{ user: User }>()
);

export const upadateUser = createAction(
  '[User] Update user',
  props<{ user: User }>()
);

export const getAlpacaOAuthToken = createAction(
  '[User] Get OAuthToken',
  props<{ userId: number; alpacaToken: string }>()
);

export const setCurrentUser = createAction(
  '[User] New value for current user',
  props<{ user: User }>()
);

export const setCurrentFollowers = createAction(
  '[User[]] New value for current user followers',
  props<{ userFollowers: User[] }>()
);

export const setCurrentFollowings = createAction(
  '[User[]] New value for current user followings',
  props<{ userFollowings: User[] }>()
);

export const loadUserSearchList = createAction(
  '[User Search List] Load all users'
);
export const loadUserSearchListSuccess = createAction(
  '[User Search List] Load Users list Success',
  props<{ userSearchList: UserSearch[] }>()
);

export const logCurrentUserOut = createAction('[User] Log user out');

export const setAppError = createAction(
  '[User] App Error',
  props<{ errorMessage: AppError }>()
);

export const updatePictureURL = createAction(
  '[User] Photo URL updated for user',
  props<{ id: number; image: File; typeSelection: string }>()
);

export const loadUserTransactions = createAction(
  '[Transactions] Load transactions list for current user',
  props<{ userId: number }>()
);

export const updateUserTransactions = createAction(
  '[Transaction[]] New transaction list for current user',
  props<{ transactions: Transaction[] }>()
);

export const processStockTransaction = createAction(
  '[Transaction[]] New stock transaction for user',
  props<{ transaction: Transaction; userId: number }>()
);

export const loadUserOwnedStocks = createAction(
  '[Stock[]] Load owned-stock list for current user',
  props<{ userId: number }>()
);

export const updateUserOwnedStocks = createAction(
  '[Stock[]] New owned-stock list for current user',
  props<{ stocks: Stock[] }>()
);

export const loadUserProfile = createAction(
  '[User] Load profile of particular user',
  props<{ username: string }>()
);

export const setCurrentProfileUser = createAction(
  '[User] Update the new profile user',
  props<{ currentProfileUser: UserProfile }>()
);

export const followUser = createAction(
  '[User] Follow user',
  props<{ followerId: number, userToFollowId: number }>()
);

export const unfollowUser = createAction(
  '[User] Unfollow user',
  props<{ followerId: number, userToUnfollowId: number }>()
);
