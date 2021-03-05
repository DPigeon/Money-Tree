import { createSelector } from '@ngrx/store';
import { State } from '../reducers/app.reducer';

interface AppState {
  appState: State;
}

export const selectAppState = (data: AppState) => data.appState;

export const selectCurrentStock = createSelector(
  selectAppState,
  (appState: State) => appState.currentStockLoaded
);

export const selectStockHistoricalData = createSelector(
  selectAppState,
  (appState: State) => appState.stockHistoricalDataLoaded
);

export const selectCurrentUser = createSelector(
  selectAppState,
  (appState: State) => appState.user
);

export const selectCurrentFollowers = createSelector(
  selectAppState,
  (appState: State) => appState.followers
);

export const selectCurrentFollowings = createSelector(
  selectAppState,
  (appState: State) => appState.followings
);

export const selectAppError = createSelector(
  selectAppState,
  (appState: State) => appState.errorMessage
);

export const selectShouldAlpacaRedirect = createSelector(
  selectAppState,
  (appState: State) => !!appState.user && !appState.user.alpacaApiKey
);

export const isUserLoggedIn = createSelector(
  selectAppState,
  (appState: State) => !!appState.user && !!appState.user.alpacaApiKey
);

export const selectAuthenticationInformation = createSelector(
  selectAppState,
  (appState: State) => ({
    userExists: !!appState.user,
    hasAlpacaCode: !!(appState.user && appState.user.alpacaApiKey),
  })
);

export const selectCurrentMarketClock = createSelector(
  selectAppState,
  (appState: State) => appState.currentMarketClock
);

export const selectUserTransactions = createSelector(
  selectAppState,
  (appState: State) => appState.userTransactions
);

export const selectUserOwnedStocks = createSelector(
  selectAppState,
  (appState: State) => appState.userOwnedStocks
);

export const selectCurrentLoadedProfile = createSelector(
  selectAppState,
  (appState: State) => appState.currentProfileUser
);

export const selectUserSearchList = createSelector(
  selectAppState,
  (appState: State) => appState.searchUserList
);
